import csv
import os
from typing import List, Dict

# Ensure we can import from the parent backend folder if run directly
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.relevance_agent import run_relevance_agent
from agents.accuracy_agent import run_accuracy_agent
from agents.hallucination_agent import run_hallucination_agent
from utils.logger import get_logger

logger = get_logger(__name__)

class BenchmarkRunner:
    def __init__(self, output_file: str = "benchmark_report.csv"):
        self.output_file = output_file
        
    def run_benchmark(self, dataset_name: str, samples: List[Dict[str, str]]):
        """
        Runs the benchmark on a list of samples.
        Expected sample format:
        {
            "question": "...",
            "response": "...",
            "reference_answer": "...",
            "source_context": "..."
        }
        """
        logger.info(f"Starting benchmark for {dataset_name} with {len(samples)} samples.")
        
        results = []
        total_relevance = 0
        total_accuracy = 0
        total_hallucination = 0
        
        for idx, sample in enumerate(samples):
            logger.info(f"Processing sample {idx + 1}/{len(samples)}")
            
            question = sample.get("question", "")
            response = sample.get("response", "")
            reference_answer = sample.get("reference_answer", "")
            source_context = sample.get("source_context", "")
            
            try:
                rel_res = run_relevance_agent(question, response)
                acc_res = run_accuracy_agent(question, response, reference_answer, source_context)
                hal_res = run_hallucination_agent(response, source_context)
                
                rel_score = rel_res.get("score", 0)
                acc_score = acc_res.get("score", 0)
                hal_score = hal_res.get("hallucination_score", 0)
                
                total_relevance += rel_score
                total_accuracy += acc_score
                total_hallucination += hal_score
                
                results.append({
                    "sample_id": idx + 1,
                    "dataset": dataset_name,
                    "question": question,
                    "relevance_score": rel_score,
                    "accuracy_score": acc_score,
                    "hallucination_score": hal_score,
                    "error": ""
                })
            except Exception as e:
                logger.error(f"Error processing sample {idx + 1}: {e}")
                results.append({
                    "sample_id": idx + 1,
                    "dataset": dataset_name,
                    "question": question,
                    "relevance_score": 0,
                    "accuracy_score": 0,
                    "hallucination_score": 0,
                    "error": str(e)
                })

        avg_rel = total_relevance / len(samples) if samples else 0
        avg_acc = total_accuracy / len(samples) if samples else 0
        avg_hal = total_hallucination / len(samples) if samples else 0
        
        logger.info(f"Benchmark Complete: {dataset_name}")
        logger.info(f"Average Relevance: {avg_rel:.2f}")
        logger.info(f"Average Accuracy: {avg_acc:.2f}")
        logger.info(f"Average Hallucination: {avg_hal:.2f}")
        
        self._save_to_csv(results, avg_rel, avg_acc, avg_hal)
        return {
            "average_relevance": avg_rel,
            "average_accuracy": avg_acc,
            "average_hallucination": avg_hal,
            "total_samples": len(samples)
        }

    def _save_to_csv(self, results: List[Dict], avg_rel: float, avg_acc: float, avg_hal: float):
        file_exists = os.path.isfile(self.output_file)
        
        with open(self.output_file, 'a', newline='', encoding='utf-8') as csvfile:
            fieldnames = ["sample_id", "dataset", "question", "relevance_score", "accuracy_score", "hallucination_score", "error"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            if not file_exists:
                writer.writeheader()
                
            for res in results:
                writer.writerow(res)
                
            # Add a summary row
            writer.writerow({
                "sample_id": "SUMMARY",
                "dataset": "AVERAGES",
                "question": "",
                "relevance_score": f"{avg_rel:.2f}",
                "accuracy_score": f"{avg_acc:.2f}",
                "hallucination_score": f"{avg_hal:.2f}",
                "error": ""
            })
        logger.info(f"Results saved to {self.output_file}")

    def load_truthfulqa(self, filepath: str, limit: int = 5) -> List[Dict]:
        samples = []
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if len(samples) >= limit:
                        break
                    # For testing, we use the Best Answer as the AI response to expect high scores
                    samples.append({
                        "question": row.get("Question", ""),
                        "response": row.get("Best Answer", ""),
                        "reference_answer": row.get("Best Answer", ""),
                        "source_context": row.get("Source", "")
                    })
        except Exception as e:
            logger.error(f"Failed to load TruthfulQA: {e}")
        return samples

# Example usage for testing directly
if __name__ == "__main__":
    runner = BenchmarkRunner(output_file="backend/test_benchmark_report.csv")
    
    # Use the downloaded TruthfulQA dataset for validation
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'TruthfulQA.csv')
    truthful_samples = runner.load_truthfulqa(csv_path, limit=3)
    
    if truthful_samples:
        runner.run_benchmark("TruthfulQA", truthful_samples)
    else:
        logger.error("No samples found. Please ensure backend/data/TruthfulQA.csv exists.")
