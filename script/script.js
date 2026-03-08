let allIssues = [];
const apiBase = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// auth check
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

async function fetchIssues() {
    const loader = document.getElementById('loader');
    const container = document.getElementById('issuesContainer');

    try {
        if (loader) loader.style.display = 'block';

        container.innerHTML = "";

        const response = await fetch(apiBase);
        const result = await response.json();

        // console.log(result);

        if (result.status === "success" && Array.isArray(result.data)) {
            allIssues = result.data;
        }

        displayIssues(allIssues);

    } catch (error) {
        console.log(error);
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

function displayIssues(issues) {
    const container = document.getElementById("issuesContainer");
    const countEl = document.getElementById("issueCount");

    container.innerHTML = "";

    if (countEl) {
        countEl.innerText = issues.length;
    }

    issues.forEach(issue => {
        const priority = issue.priority ? issue.priority.toLowerCase() : 'high';
        
        let topBorderClass = 'border-t-4 border-t-[#3FB950]'; 
        if (priority === 'low') {
            topBorderClass = 'border-t-4 border-t-[#A371F7]';
        }

        const card = document.createElement("div");
        card.className = `cursor-pointer bg-white border border-gray-200 ${topBorderClass} rounded-lg shadow-sm font-sans hover:shadow-md transition`;

        card.innerHTML = `
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="w-8 h-8 rounded-full border-2 border-dashed border-green-400 flex items-center justify-center">
              <div class="w-4 h-4 rounded-full bg-green-100"></div>
            </div>
            <span class="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full tracking-wide uppercase">
              ${issue.priority || "HIGH"}
            </span>
          </div>

          <h2 class="text-xl font-bold text-gray-800 leading-tight mb-2">
            ${issue.title || "No Title"}
          </h2>

          <p class="text-gray-500 text-sm mb-6 line-clamp-2">
            ${issue.description || "No description available"}
          </p>

          <div class="flex gap-2 mb-8">
            <span class="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-400 rounded-full text-xs font-semibold border border-red-100 uppercase">
              <span class="w-2 h-2 bg-red-400 rounded-full"></span> BUG
            </span>
            <span class="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-xs font-semibold border border-orange-100 uppercase">
              <span class="w-2 h-2 bg-orange-500 rounded-full"></span> HELP WANTED
            </span>
          </div>

          <hr class="border-gray-100 mb-4" />

          <div class="text-gray-400 text-xs space-y-1 flex justify-between items-center">
            <span>#${issue.id ? String(issue.id).slice(-4) : "01"} by <b>${issue.author || "User"}</b></span>
            <span>${new Date(issue.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
        `;

        card.onclick = () => openIssueDetails(issue);
        container.appendChild(card);
    });
}

function filterData(status) {
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.classList.remove('bg-blue-700', 'text-white');
        btn.classList.add('text-gray-700');
    });
    const activeTab = document.getElementById(`tab-${status}`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-700');
        activeTab.classList.add('bg-blue-700', 'text-white');
    }
    if (status === 'all') {
        displayIssues(allIssues);
    } else {
        const filtered = allIssues.filter(item => item.status.toLowerCase() === status.toLowerCase());
        displayIssues(filtered);
    }
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allIssues.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm) || 
        issue.description.toLowerCase().includes(searchTerm)
    );
    displayIssues(filtered);
}

function openIssueDetails(issue) {
    const modal = document.getElementById('issueModal');
    
    document.getElementById('modalTitle').innerText = issue.title;
    document.getElementById('modalDescription').innerText = issue.description || 'No description provided.';
    document.getElementById('modalAuthor').innerText = issue.author || 'User';
    document.getElementById('modalAssignee').innerText = issue.author || 'Fahim Ahmed';
    document.getElementById('modalDate').innerText = new Date(issue.createdAt).toLocaleDateString();
    
    const statusEl = document.getElementById('modalStatus');
    statusEl.innerText = issue.status;
    statusEl.className = `px-3 py-1 rounded-full text-white ${issue.status.toLowerCase() === 'open' ? 'bg-green-500' : 'bg-purple-500'}`;
    
    const priorityEl = document.getElementById('modalPriority');
    priorityEl.innerText = issue.priority || 'HIGH';
    priorityEl.className = `px-4 py-1 text-white text-xs font-bold rounded-md uppercase ${issue.priority?.toLowerCase() === 'high' ? 'bg-red-500' : 'bg-orange-400'}`;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('issueModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

fetchIssues();