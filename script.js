import { pipeline } from '@huggingface/transformers';

const MODEL_NAME = 'google/gemma-4-26B-A4B-it'; // Replace with the specific Gemma 4 model
const max_new_tokens = 100; // Limit for generated tokens

const promptInput = document.getElementById('prompt');
const generateButton = document.getElementById('generateButton');
const statusDiv = document.getElementById('status');
const outputDiv = document.getElementById('output');

let generator = null; // Stores the loaded pipeline

// Function to load the model
async function loadModel() {
    statusDiv.textContent = `Loading model: ${MODEL_NAME}... This might take a while.`;
    generateButton.disabled = true;
    try {
        // Initialize the text-generation pipeline with the Gemma 4 model
        // This will automatically download and cache the model weights in the browser's IndexedDB
        generator = await pipeline('text-generation', MODEL_NAME);
        statusDiv.textContent = 'Model loaded successfully! Enter a prompt and click "Generate Text".';
        generateButton.disabled = false;
    } catch (error) {
        statusDiv.textContent = `Error loading model: ${error.message}. Please check your console for details.`;
        console.error('Error loading model:', error);
    }
}

// Function to generate text
async function generateText() {
    if (!generator) {
        alert('Model is not loaded yet. Please wait.');
        return;
    }

    const prompt = promptInput.value;
    if (!prompt) {
        alert('Please enter a prompt.');
        return;
    }

    outputDiv.textContent = ''; // Clear previous output
    statusDiv.textContent = 'Generating text...';
    generateButton.disabled = true;

    try {
        // Perform text generation
        const response = await generator(prompt, {
            max_new_tokens: max_new_tokens,
            // You might add other generation parameters here like do_sample, temperature, top_k, etc.
        });

        // The response is an array, take the first element's generated_text
        outputDiv.textContent = response[0].generated_text;
        statusDiv.textContent = 'Generation complete.';
    } catch (error) {
        statusDiv.textContent = `Error generating text: ${error.message}. Please check your console for details.`;
        console.error('Error generating text:', error);
    } finally {
        generateButton.disabled = false;
    }
}

// Event Listeners
generateButton.addEventListener('click', generateText);

// Load the model when the page loads
window.addEventListener('load', loadModel);

// --- Image Understanding with transformers.js ---
// As of current transformers.js capabilities, direct multimodal pipeline for
// image understanding with Gemma 4 (like the Python example) might not be
// as straightforward or might require specific model variants and pipelines.
// This example focuses on text generation, which is a common and well-supported use case.
// For image understanding in the browser, you might need to explore dedicated
// vision models or send images to a backend for processing.
