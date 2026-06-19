import express from 'express';
console.log('??Express imported');
import cors from 'cors';
console.log('??CORS imported');
import helmet from 'helmet';
console.log('??Helmet imported');
import { GoogleGenerativeAI } from '@google/generative-ai';
console.log('??Google AI imported');
import { StateGraph } from '@langchain/langgraph';
console.log('??LangGraph imported');
import pino from 'pino';
console.log('??Pino imported');
import pool from './db/index.js';
console.log('??DB Pool imported');

console.log('?? Minimal server linked successfully');
process.exit(0);
