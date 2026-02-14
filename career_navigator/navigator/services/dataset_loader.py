import os
from datasets import load_dataset
import pandas as pd

_dataset = None
_dataframe = None

def load_job_dataset():
    global _dataset, _dataframe

    if _dataframe is None:
        dataset_id = os.getenv("JOB_DATASET_ID", "xanderios/job-postings")
        try:
            _dataset = load_dataset(dataset_id)
            _dataframe = _dataset["train"].to_pandas()
        except Exception:
            _dataframe = pd.DataFrame(columns=["title", "description"])

    return _dataframe


def get_role_descriptions(role_name, limit=50):
    df = load_job_dataset()

    filtered = df[df["title"].str.contains(role_name, case=False, na=False)]
    filtered = filtered.head(limit)

    descriptions = " ".join(filtered["description"].dropna().tolist())

    return descriptions
