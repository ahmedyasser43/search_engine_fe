async function fetchAnalytics() {
  const analyticsDiv = document.getElementById('analytics');
  analyticsDiv.innerHTML = 'Loading...';
  try {
    // Replace with your actual endpoint
    let data;
    try {
      const response = await axios.get('https://searchengine-production-ee44.up.railway.app/search_analytics/');
      data = response.data.body;
      
    } catch (error) {
      console.error("Suggestions error:", error);
      alert("Could not fetch suggestions. Try disabling ad blockers or opening in Incognito.");
    }

    // Top Searches Table
    let topSearchesTable = `
      <h2>Top Searches</h2>
      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Count</th>
            <th>First Searched</th>
            <th>Last Searched</th>
          </tr>
        </thead>
        <tbody>
          ${data.top_searches.map(s =>
            `<tr>
              <td>${s.term}</td>
              <td>${s.count}</td>
              <td>${new Date(s.created_at).toLocaleString()}</td>
              <td>${new Date(s.updated_at).toLocaleString()}</td>
            </tr>`
          ).join('')}
        </tbody>
      </table>
    `;

    // Analytics Counts By Time Range Table
    // Create a canvas for the chart
    let countsByHourTable = `
      <h2>Searches by Hour</h2>
      <canvas id="countsByHourChart" width="600" height="300"></canvas>
    `;

    // After rendering, draw the chart
    setTimeout(() => {
      const ctx = document.getElementById('countsByHourChart').getContext('2d');
      const labels = Object.keys(data.analytics_counts_by_time_range).map(hour => `${hour}:00`);
      const counts = Object.values(data.analytics_counts_by_time_range);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Searches',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        },
        options: {
          scales: {
            x: { title: { display: true, text: 'Hour' } },
            y: { title: { display: true, text: 'Count' }, beginAtZero: true }
          }
        }
      });
    }, 0);

    // Terms Analytics By Time Range Table
    let termsByHourTable = `
      <h2>Terms by Hour</h2>
      <table>
        <thead>
          <tr>
            <th>Hour</th>
            <th>Terms (comma separated)</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(data.terms_analytics_by_time_range)
            .filter(([_, terms]) => Array.isArray(terms) && terms.length > 0)
            .map(([hour, terms]) =>
              `<tr>
                <td>${hour}:00</td>
                <td>${terms.join(', ')}</td>
              </tr>`
            ).join('')}
        </tbody>
      </table>
    `;

    // Analytics by Region Table
    let regionTable = `
      <h2>Searches by Region</h2>
      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(data.analytics_by_region).map(([region, count]) =>
            `<tr>
              <td>${region}</td>
              <td>${count}</td>
            </tr>`
          ).join('')}
        </tbody>
      </table>
    `;

    analyticsDiv.innerHTML = topSearchesTable + countsByHourTable + termsByHourTable + regionTable;
  } catch (err) {
    analyticsDiv.innerHTML = '<p style="color:red;">Failed to load analytics.</p>';
    console.error(err);
  }
}

document.getElementById('refresh-btn').addEventListener('click', fetchAnalytics);
fetchAnalytics();