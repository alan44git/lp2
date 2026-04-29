async function loadEmployees() {
  const statusEl = document.getElementById('status');
  const gridEl = document.getElementById('employeeGrid');

  try {
    const response = await fetch('/api/employees');
    if (!response.ok) {
      throw new Error('Unable to fetch employee data.');
    }

    const employees = await response.json();
    gridEl.innerHTML = '';

    if (!Array.isArray(employees) || employees.length === 0) {
      statusEl.textContent = 'No employees found.';
      return;
    }

    employees.forEach((employee) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img class="profile" src="${employee.profileImage}" alt="${employee.name}" />
        <h2 class="name">${employee.name}</h2>
        <p class="detail"><strong>Designation:</strong> ${employee.designation}</p>
        <p class="detail"><strong>Department:</strong> ${employee.department}</p>
        <p class="detail"><strong>Salary:</strong> ?${Number(employee.salary).toLocaleString('en-IN')}</p>
      `;
      gridEl.appendChild(card);
    });

    statusEl.textContent = `Loaded ${employees.length} employee records.`;
  } catch (error) {
    statusEl.textContent = 'Failed to load employee details.';
  }
}

loadEmployees();