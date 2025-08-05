import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import json
import sys
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
import numpy as np

class ModelTrainer:
    def __init__(self):
        self.results = {
            "models": [],                                                                                  
            "metrics": {},
            "confusion_matrices": {},
            "classification_reports": {},
            "feature_info": {}
        }
        self.label_encoder = None

    def load_and_preprocess_data(self, file_path, target_column='Activity'):
        """Loads and preprocesses the data."""
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            print(f"Error loading file: {str(e)}")
            return None, None, None

        # Drop columns that are entirely empty or not useful
        df = df.dropna(axis=1, how='all')
        
        # Handle timestamp - extract useful features or drop
        if 'Timestamp' in df.columns:
            try:
                df['Timestamp'] = pd.to_datetime(df['Timestamp'])
                df['Hour'] = df['Timestamp'].dt.hour
                df['Minute'] = df['Timestamp'].dt.minute
                df = df.drop('Timestamp', axis=1)
            except Exception as e:
                print(f"Error processing timestamp: {str(e)}")
                df = df.drop('Timestamp', axis=1)

        # Separate features and target
        if target_column not in df.columns:
            print(f"Error: Target column '{target_column}' not found")
            return None, None, None
            
        X = df.drop(target_column, axis=1)
        y = df[target_column]

        # Identify feature types
        numeric_features = X.select_dtypes(include=['int64', 'float64']).columns
        categorical_features = X.select_dtypes(include=['object']).columns

        # Preprocessing pipeline
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())])

        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))])

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('cat', categorical_transformer, categorical_features)])

        # Encode target if needed
        if y.dtype == 'object':
            self.label_encoder = LabelEncoder()
            y = self.label_encoder.fit_transform(y)
            print(f"Encoded target. Classes: {list(self.label_encoder.classes_)}")

        return preprocessor, X, y

    def train_and_evaluate(self, model, preprocessor, X_train, y_train, X_test, y_test, model_name):
        """Trains and evaluates a model."""
        print(f"\n--- {model_name} ---")
        
        try:
            # Create full pipeline
            pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                    ('classifier', model)])
            
            # Train model
            pipeline.fit(X_train, y_train)
            
            # Make predictions
            y_pred = pipeline.predict(X_test)
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            clf_report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
            cm = confusion_matrix(y_test, y_pred).tolist()
            
            # Store results
            self.results["models"].append(model_name)
            self.results["metrics"][model_name] = {
                "accuracy": accuracy,
                "precision": clf_report['weighted avg']['precision'],
                "recall": clf_report['weighted avg']['recall'],
                "f1_score": clf_report['weighted avg']['f1-score']
            }
            self.results["confusion_matrices"][model_name] = cm
            self.results["classification_reports"][model_name] = clf_report
            
            # Print output for Node.js to capture
            print(f"Accuracy: {accuracy:.4f}")
            print("Classification Report:")
            print(classification_report(y_test, y_pred, zero_division=0))
            print("Confusion Matrix:")
            print(cm)
            
        except Exception as e:
            print(f"Error training {model_name}: {str(e)}")
            self.results["models"].append(model_name)
            self.results["metrics"][model_name] = {
                "error": str(e)
            }

    def run_pipeline(self, file_path, target_column):
        """Main pipeline execution."""
        preprocessor, X, y = self.load_and_preprocess_data(file_path, target_column)
        if X is None or y is None:
            return None

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42, stratify=y)

        # Initialize models
        models = {
            "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
            "Support Vector Machine": SVC(random_state=42, probability=True),
            "Decision Tree": DecisionTreeClassifier(random_state=42, max_depth=5),
            "Random Forest": RandomForestClassifier(random_state=42, n_estimators=100),
            "Ensemble (RF+KNN+DT)": VotingClassifier(estimators=[
                ('rf', RandomForestClassifier(random_state=42, n_estimators=100)),
                ('knn', KNeighborsClassifier(n_neighbors=5)),
                ('dt', DecisionTreeClassifier(random_state=42, max_depth=5))
            ], voting='hard')
        }

        # Train and evaluate each model
        for name, model in models.items():
            self.train_and_evaluate(model, preprocessor, X_train, y_train, X_test, y_test, name)

        # Add feature information
        self.results["feature_info"] = {
            "num_features": X.shape[1],
            "feature_names": list(X.columns),
            "target_classes": (list(self.label_encoder.classes_) 
                             if self.label_encoder is not None 
                             else list(np.unique(y)))
        }

        return self.results

def main():
    if len(sys.argv) < 2:
        print("Usage: python script.py <file_path> [target_column]", file=sys.stderr)
        sys.exit(1)

    file_path = sys.argv[1]
    target_column = sys.argv[2] if len(sys.argv) > 2 else 'Activity'

    trainer = ModelTrainer()
    results = trainer.run_pipeline(file_path, target_column)

    # Output final JSON for Node.js to parse
    if results:
        print(json.dumps(results))  # ✅ Only JSON on stdout
    else:
        print("No results to output", file=sys.stderr)

if __name__ == "__main__":
    main()
 