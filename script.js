import { createDropdown } from "./suggestions_dropdown.js";

const searchBtn = document.getElementById('search-btn');
const queryInput = document.getElementById('query');
const resultsDiv = document.getElementById('results');

queryInput.addEventListener('focusin', async () => {
  try {
    const api_url = `https://searchengine-production-ee44.up.railway.app/search_suggestions`;

    const response = await axios.get(api_url);
    const suggestions = response.data.body;

    // Remove previous dropdown if exists
    let dropdown = document.getElementById('results-dropdown');
    if (dropdown) dropdown.remove();

    // Only show dropdown if there are suggestions
    if (Array.isArray(suggestions) && suggestions.length > 0) {

      dropdown = createDropdown(suggestions,queryInput, false)
      resultsDiv.appendChild(dropdown);

      // Remove suggestions when clicking outside
      document.addEventListener('mousedown', function handler(e) {
        if (!dropdown.contains(e.target) && e.target !== queryInput) {
          dropdown.remove();
          document.removeEventListener('mousedown', handler);
        }
      });
    }
  } catch (err) {
    console.error('Suggestions error:', err);
  }
});

searchBtn.addEventListener('click', async () => {
  const query = queryInput.value.trim();
  if (!query) return;

  try {
    const api_url = `https://searchengine-production-ee44.up.railway.app/search_suggestions?query=${encodeURIComponent(query)}`
    console.log("API UR: ", api_url);
    
    const response = await axios.get(api_url);

    const suggestions = response.data.body
    resultsDiv.innerHTML = '';
    
    // Clear previous suggestions
    let dropdown = document.getElementById('results-dropdown');
    if (dropdown) dropdown.remove();
    dropdown = createDropdown(suggestions,queryInput, true)

    // Append suggestions list just below the input, inside resultsDiv
    resultsDiv.appendChild(dropdown);

    // Remove suggestions when clicking outside
    document.addEventListener('mousedown', function handler(e) {
      if (!dropdown.contains(e.target) && e.target !== queryInput) {
        dropdown.remove();
        document.removeEventListener('mousedown', handler);
      }
    });

  } catch (err) {
    console.error('Search error:', err);
    resultsDiv.innerHTML = '<p style="color:red;">Something went wrong.</p>';
  }
});

// To detect when the user adds or deletes data in the input, use the 'input' event:
queryInput.addEventListener('input', async (query) => {

  const api_url = `https://searchengine-production-ee44.up.railway.app/search_suggestions?query=${query.target.value}`;
  console.log("API URL: ", api_url);

  const response = await axios.get(api_url);
  const suggestions = response.data.body;
  // Handle input changes here (adding or deleting data)
  console.log('Input changed:', query.target.value);
   let dropdown = document.getElementById('results-dropdown');
    if (dropdown) dropdown.remove();

    // Only show dropdown if there are suggestions
    if (Array.isArray(suggestions) && suggestions.length > 0) {

      dropdown = createDropdown(suggestions,queryInput, true)
      resultsDiv.appendChild(dropdown);

      // Remove suggestions when clicking outside
      document.addEventListener('mousedown', function handler(e) {
        if (!dropdown.contains(e.target) && e.target !== queryInput) {
          dropdown.remove();
          document.removeEventListener('mousedown', handler);
        }
      });
    }
});