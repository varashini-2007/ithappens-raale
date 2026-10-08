import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# Set seed for reproducible deterministic training
np.random.seed(42)

CLASSES = ['Normal', 'Port Scan', 'Brute Force', 'Lateral Movement', 'Data Exfiltration']
FEATURE_NAMES = [
    'unique_ports',
    'connections',
    'time_window_sec',
    'failed_logins',
    'bytes_transferred',
    'new_internal_peers',
    'unusual_services',
    'conn_rate',
    'port_diversity',
    'failed_login_rate',
    'byte_egress_rate'
]

def generate_synthetic_telemetry(n_samples=3000):
    X = []
    y = []

    samples_per_class = n_samples // len(CLASSES)

    for _ in range(samples_per_class):
        # 1. Normal traffic (Routine HTTP, DNS, SMB, TLS)
        tw = np.random.uniform(10, 180)
        conns = np.random.randint(1, 20)
        up = np.random.randint(1, 4)
        fl = np.random.choice([0, 0, 0, 1])
        b = np.random.uniform(500, 5_000_000)
        peers = np.random.choice([0, 1])
        unusual = 0
        feat = [
            up, conns, tw, fl, b, peers, unusual,
            conns / tw, up / max(conns, 1), fl / tw, b / tw
        ]
        X.append(feat)
        y.append(0)

    for _ in range(samples_per_class):
        # 2. Port Scan (High unique destination ports, rapid burst, TCP SYN)
        tw = np.random.uniform(15, 45)
        conns = np.random.randint(120, 250)
        up = np.random.randint(30, 80)
        fl = 0
        b = np.random.uniform(10_000, 100_000)
        peers = 0
        unusual = np.random.randint(1, 4)
        feat = [
            up, conns, tw, fl, b, peers, unusual,
            conns / tw, up / max(conns, 1), fl / tw, b / tw
        ]
        X.append(feat)
        y.append(1)

    for _ in range(samples_per_class):
        # 3. Brute Force (High failed logins, low unique ports, repeated auth attempts)
        tw = np.random.uniform(30, 90)
        conns = np.random.randint(25, 60)
        up = np.random.choice([1, 2])
        fl = np.random.randint(25, 70)
        b = np.random.uniform(50_000, 300_000)
        peers = 0
        unusual = 0
        feat = [
            up, conns, tw, fl, b, peers, unusual,
            conns / tw, up / max(conns, 1), fl / tw, b / tw
        ]
        X.append(feat)
        y.append(2)

    for _ in range(samples_per_class):
        # 4. Lateral Movement (New internal peers, unusual RPC/SMB services accessed)
        tw = np.random.uniform(60, 240)
        conns = np.random.randint(40, 120)
        up = np.random.randint(3, 8)
        fl = np.random.randint(0, 4)
        b = np.random.uniform(1_000_000, 15_000_000)
        peers = np.random.randint(5, 15)
        unusual = np.random.randint(3, 10)
        feat = [
            up, conns, tw, fl, b, peers, unusual,
            conns / tw, up / max(conns, 1), fl / tw, b / tw
        ]
        X.append(feat)
        y.append(3)

    for _ in range(samples_per_class):
        # 5. Data Exfiltration (Massive outbound egress, high byte rate)
        tw = np.random.uniform(60, 300)
        conns = np.random.randint(50, 160)
        up = np.random.choice([1, 2, 3])
        fl = 0
        b = np.random.uniform(400_000_000, 1_500_000_000) # 400 MB to 1.5 GB
        peers = np.random.choice([0, 1])
        unusual = np.random.choice([0, 1, 2])
        feat = [
            up, conns, tw, fl, b, peers, unusual,
            conns / tw, up / max(conns, 1), fl / tw, b / tw
        ]
        X.append(feat)
        y.append(4)

    return np.array(X), np.array(y)

print("1. Generating synthetic telemetry dataset...")
X, y = generate_synthetic_telemetry(n_samples=3500)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

print(f"Dataset shape: {X.shape}, Features: {len(FEATURE_NAMES)}, Classes: {len(CLASSES)}")

# Train Isolation Forest on normal baseline (y == 0)
print("2. Training Isolation Forest Anomaly Detector...")
iso_forest = IsolationForest(n_estimators=30, max_samples=256, contamination=0.08, random_state=42)
iso_forest.fit(X_train[y_train == 0])

# Train Random Forest Classifier
print("3. Training Random Forest Threat Classifier...")
rf = RandomForestClassifier(n_estimators=20, max_depth=6, random_state=42)
rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Random Forest Test Accuracy: {acc * 100:.2f}%")
print(classification_report(y_test, y_pred, target_names=CLASSES))

# Export trees to a compact JSON format for client-side evaluation
def export_tree(tree_estimator):
    t = tree_estimator.tree_
    nodes = []
    for i in range(t.node_count):
        is_leaf = t.children_left[i] == -1 and t.children_right[i] == -1
        if is_leaf:
            values = t.value[i][0].tolist()
            # Normalize probabilities
            s = sum(values)
            prob = [v / s for v in values] if s > 0 else values
            nodes.append({
                'id': i,
                'isLeaf': True,
                'prob': prob
            })
        else:
            nodes.append({
                'id': i,
                'isLeaf': False,
                'feature': int(t.feature[i]),
                'threshold': float(t.threshold[i]),
                'left': int(t.children_left[i]),
                'right': int(t.children_right[i])
            })
    return nodes

exported_forest = [export_tree(estimator) for estimator in rf.estimators_]

# Feature baselines and standard deviations for SHAP / attribution approximation
means = np.mean(X_train[y_train == 0], axis=0).tolist()
stds = np.std(X_train[y_train == 0], axis=0).tolist()

model_payload = {
    'version': '2.4.0',
    'trainedDate': '2026-10-08',
    'classes': CLASSES,
    'features': FEATURE_NAMES,
    'testAccuracy': round(acc * 100, 2),
    'numTrees': len(exported_forest),
    'trees': exported_forest,
    'normalBaselines': {
        'means': means,
        'stds': stds
    },
    'featureImportances': [round(float(imp), 4) for imp in rf.feature_importances_]
}

import os
os.makedirs('src/ml', exist_ok=True)
output_path = 'src/ml/modelWeights.json'
with open(output_path, 'w') as f:
    json.dump(model_payload, f, indent=2)

print(f"SUCCESS: Model exported to {output_path} (Size: {len(json.dumps(model_payload))} bytes)")
