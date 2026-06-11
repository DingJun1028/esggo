from transformers import AutoTokenizer, AutoProcessor, AutoModelForCausalLM
from PIL import Image
import torch

# --- Configuration ---
# Replace with the actual Gemma 4 model you want to use.
# For example, "google/gemma-4-26B-A4B-it" or "google/gemma-4-31B-it"
# Ensure you have access to this model on Hugging Face.
MODEL_NAME = "google/gemma-4-26B-A4B-it"

# --- Load Model and Processor ---
print(f"Loading tokenizer and processor for {MODEL_NAME}...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
processor = AutoProcessor.from_pretrained(MODEL_NAME)
print("Loading model...")
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
print("Model loaded successfully.")

# --- 1. Text Generation Example ---
def generate_text(prompt, max_new_tokens=50):
    print(f"
--- Text Generation ---")
    print(f"Prompt: {prompt}")

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=max_new_tokens)
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"Generated text: {generated_text}")
    return generated_text

# --- 2. Image Understanding Example ---
def understand_image(image_path, text_prompt, max_new_tokens=50):
    print(f"
--- Image Understanding ---")
    print(f"Image path: {image_path}")
    print(f"Text prompt: {text_prompt}")

    try:
        image = Image.open(image_path).convert("RGB")
    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Prepare inputs for multimodal model
    # The exact format might vary slightly based on the specific Gemma 4 variant.
    # This example assumes a common multimodal input structure.
    inputs = processor(text=text_prompt, images=image, return_tensors="pt")

    # Generate output based on image and text
    outputs = model.generate(**inputs, max_new_tokens=max_new_tokens)
    generated_description = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"Generated description/answer: {generated_description}")
    return generated_description

# --- Main Execution ---
if __name__ == "__main__":
    # Example 1: Pure text generation
    text_prompt_1 = "Write a short poem about a serene forest."
    generate_text(text_prompt_1)

    text_prompt_2 = "Explain the concept of quantum entanglement in simple terms."
    generate_text(text_prompt_2)

    # Example 2: Image understanding
    # For this to work, you need an image file.
    # Create a dummy image file for demonstration purposes.
    # In a real scenario, replace 'path/to/your/image.jpg' with your actual image.
    dummy_image_path = "dummy_image.jpg"
    try:
        # Create a simple red square image for demonstration
        dummy_image = Image.new('RGB', (200, 200), color = 'red')
        dummy_image.save(dummy_image_path)
        print(f"
Created dummy image at {dummy_image_path}")
    except Exception as e:
        print(f"Could not create dummy image: {e}. Please ensure you have write permissions or create an image manually.")
        dummy_image_path = None

    if dummy_image_path:
        image_prompt_1 = "Describe what you see in this image."
        understand_image(dummy_image_path, image_prompt_1)

        image_prompt_2 = "What color is the main object in the image?"
        understand_image(dummy_image_path, image_prompt_2)
