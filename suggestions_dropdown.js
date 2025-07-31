export function createDropdown(suggestions, queryInput, is_matched) {
  const dropdown = document.createElement('ul');
  dropdown.id = 'results-dropdown';
  dropdown.style.background = '#fff';
  dropdown.style.border = '1px solid #ccc';
  dropdown.style.width = '100%';
  dropdown.style.listStyle = 'none';
  dropdown.style.margin = 0;
  dropdown.style.padding = 0;
  dropdown.style.zIndex = 1000;
  dropdown.style.position = 'static';

  const liTitle = buildListTitle(is_matched)

  dropdown.appendChild(liTitle)

  suggestions.forEach(result => {
    const li = document.createElement('li');
    li.className = 'result-item';
    li.value=result.id
    li.textContent = result.term;
    li.style.padding = '8px';
    li.style.cursor = 'pointer';
    li.addEventListener('mousedown', () => {
          search_by_id(result.id)
          queryInput.value = result.term;
          dropdown.remove();
        });
    dropdown.appendChild(li);
  });

  return dropdown;
}

async function search_by_id(id) {
    try {
      const api_url = `https://searchengine-production-ee44.up.railway.app/search_engine/search?id=${id}`;
      const response = await axios.get(api_url);
    } catch (error) {
      console.error("Suggestions error:", error);
      alert("Could not fetch suggestions. Try disabling ad blockers or opening in Incognito.");
    }
    console.log(id);
}

function buildListTitle(is_matched) {
    const liTitle = document.createElement('li');
    liTitle.className = 'result-item';
    if (is_matched)
        liTitle.textContent = "Top Matches For you";
    else
        liTitle.textContent = "Top Searches around you";
    liTitle.style.padding = '12px';
    liTitle.style.fontWeight = 'bold';
    liTitle.style.background = '#f5f5f5';

    return liTitle;
}