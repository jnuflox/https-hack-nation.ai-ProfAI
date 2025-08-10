// Simple Gemini API test
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function simpleTest() {
  try {
    console.log('Testing Gemini connection...');
    const genAI = new GoogleGenerativeAI("sk_66695092ea908aebd144a2a79e0de62f949f5f50551c05b9");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Gemini responded:', text);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

simpleTest();
