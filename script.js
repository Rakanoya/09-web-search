// Get references to DOM elements
const topicSelect = document.getElementById('topicSelect');
const responseDiv = document.getElementById('response');

// Add change event listener to the select
topicSelect.addEventListener('change', async () => {
  try {
    // Check if API key is available
    if (!apiKey || apiKey === 'your-api-key-here') {
      responseDiv.textContent = 'Please add your OpenAI API key to secrets.js';
      return;
    }

    // Show loading state
    responseDiv.textContent = 'Loading...';
    
    // Get the selected topic
    const topic = topicSelect.value;

    // Prepare the prompt
    const prompt = `Give me a recent story about ${topic}.`;

    // Make API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes recent stories about the provided topic from this week. Keep your answers brief, clear, and engaging for a general audience.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000
      })
    });

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Format and update the UI with the response
    const text = data.choices[0].message.content;
    const formattedText = text
      .split('\n\n')  // Split into paragraphs
      .filter(para => para.trim() !== '')  // Remove empty paragraphs
      .map(para => `<p>${para}</p>`)  // Wrap in p tags
      .join('');
    
    responseDiv.innerHTML = formattedText;

  } catch (error) {
    // Handle any errors
    responseDiv.textContent = 'Sorry, there was an error getting the update. Please try again.';
    console.error('Error:', error);
  }
});
