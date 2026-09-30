const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting Comprehensive Live API Verification...\n');
  let results = { passed: 0, failed: 0, tests: [] };

  const report = (name, ok, details = '') => {
    if (ok) {
      results.passed++;
      console.log(`✅ [PASS] ${name} ${details}`);
    } else {
      results.failed++;
      console.log(`❌ [FAIL] ${name} ${details}`);
    }
    results.tests.push({ name, ok, details });
  };

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/`);
    const data = await res.json();
    report('Health Check (GET /)', res.status === 200, JSON.stringify(data));
  } catch (err) {
    report('Health Check (GET /)', false, err.message);
  }

  // 2. Register Tenant (Admin)
  const timestamp = Date.now();
  const testTenant = {
    name: `Enterprise Org ${timestamp}`,
    email: `tenant_${timestamp}@enterprise.com`,
    password: 'Password123!',
    domain: `enterprise${timestamp}`
  };

  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testTenant)
    });
    const regData = await regRes.json();
    report('Tenant Register (POST /api/auth/register)', regRes.status === 201, `Status: ${regRes.status}, Msg: ${regData.message}`);
  } catch (err) {
    report('Tenant Register (POST /api/auth/register)', false, err.message);
  }

  // 3. Login Tenant (Admin)
  let adminCookie = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testTenant.email,
        password: testTenant.password
      })
    });
    const loginData = await loginRes.json();
    const setCookie = loginRes.headers.get('set-cookie');
    if (setCookie) {
      adminCookie = setCookie.split(';')[0];
    }
    report('Tenant Login (POST /api/auth/login)', loginRes.status === 200, `Status: ${loginRes.status}, Role: ${loginData.role}`);
  } catch (err) {
    report('Tenant Login (POST /api/auth/login)', false, err.message);
  }

  // 4. Verify Auth / Check Current User
  try {
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Cookie': adminCookie }
    });
    const meData = await meRes.json();
    report('Get Me (GET /api/auth/me)', meRes.status === 200, `Status: ${meRes.status}, User: ${meData.user?.email || meData.email}`);
  } catch (err) {
    report('Get Me (GET /api/auth/me)', false, err.message);
  }

  // 5. Create Department
  let deptId = null;
  try {
    const deptRes = await fetch(`${BASE_URL}/api/admin/addDepartment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      },
      body: JSON.stringify({
        name: `Engineering ${timestamp}`,
        description: 'Software & Cloud Engineering'
      })
    });
    const deptData = await deptRes.json();
    if (deptRes.status === 200 || deptRes.status === 201) {
      deptId = deptData.department?.id || deptData.id || deptData.data?.id;
    }
    report('Add Department (POST /api/admin/addDepartment)', deptRes.status === 200 || deptRes.status === 201, `Status: ${deptRes.status}`);
  } catch (err) {
    report('Add Department (POST /api/admin/addDepartment)', false, err.message);
  }

  // 6. Get All Departments
  try {
    const deptsRes = await fetch(`${BASE_URL}/api/admin/getDepartment`, {
      headers: { 'Cookie': adminCookie }
    });
    const deptsData = await deptsRes.json();
    const deptsList = Array.isArray(deptsData) ? deptsData : (deptsData.departments || deptsData.department || []);
    if (!deptId && deptsList.length > 0) {
      deptId = deptsList[0].id;
    }
    report('Get Departments (GET /api/admin/getDepartment)', deptsRes.status === 200, `Status: ${deptsRes.status}, Count: ${deptsList.length}`);
  } catch (err) {
    report('Get Departments (GET /api/admin/getDepartment)', false, err.message);
  }

  // 7. Add Manager Employee
  const mgrEmail = `mgr_${timestamp}@enterprise.com`;
  let managerId = null;
  try {
    const mgrRes = await fetch(`${BASE_URL}/api/auth/addEmployee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Manager',
        email: mgrEmail,
        role: 'MANAGER',
        departmentId: deptId,
        salary: 120000
      })
    });
    const mgrData = await mgrRes.json();
    if (mgrRes.status === 200 || mgrRes.status === 201) {
      managerId = mgrData.employee?.id || mgrData.id;
    }
    report('Add Manager Employee (POST /api/auth/addEmployee)', mgrRes.status === 200 || mgrRes.status === 201, `Status: ${mgrRes.status}, ID: ${managerId}`);
  } catch (err) {
    report('Add Manager Employee (POST /api/auth/addEmployee)', false, err.message);
  }

  // 8. Get All Employees
  try {
    const empsRes = await fetch(`${BASE_URL}/api/admin/getEmployee`, {
      headers: { 'Cookie': adminCookie }
    });
    const empsData = await empsRes.json();
    const count = Array.isArray(empsData) ? empsData.length : (empsData.employees?.length || 0);
    report('Get Employees (GET /api/admin/getEmployee)', empsRes.status === 200, `Status: ${empsRes.status}, Count: ${count}`);
  } catch (err) {
    report('Get Employees (GET /api/admin/getEmployee)', false, err.message);
  }

  // 9. Add Project with valid Manager
  let projId = null;
  try {
    const projRes = await fetch(`${BASE_URL}/api/admin/addProject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      },
      body: JSON.stringify({
        name: `HRM Cloud Platform ${timestamp}`,
        client: 'Acme Enterprise',
        managerId: managerId,
        status: 'ONGOING',
        deadline: new Date(Date.now() + 86400000 * 30).toISOString()
      })
    });
    const projData = await projRes.json();
    if (projRes.status === 200 || projRes.status === 201) {
      projId = projData.project?.id || projData.id;
    }
    report('Add Project (POST /api/admin/addProject)', projRes.status === 200 || projRes.status === 201, `Status: ${projRes.status}`);
  } catch (err) {
    report('Add Project (POST /api/admin/addProject)', false, err.message);
  }

  // 10. Get Projects
  try {
    const projsRes = await fetch(`${BASE_URL}/api/admin/getProject`, {
      headers: { 'Cookie': adminCookie }
    });
    const projsData = await projsRes.json();
    const count = Array.isArray(projsData) ? projsData.length : (projsData.projects?.length || 0);
    report('Get Projects (GET /api/admin/getProject)', projsRes.status === 200, `Status: ${projsRes.status}, Count: ${count}`);
  } catch (err) {
    report('Get Projects (GET /api/admin/getProject)', false, err.message);
  }

  // 11. Admin Dashboard Stats
  try {
    const statsRes = await fetch(`${BASE_URL}/api/admin/dashboard-stats`, {
      headers: { 'Cookie': adminCookie }
    });
    report('Admin Dashboard Stats (GET /api/admin/dashboard-stats)', statsRes.status === 200, `Status: ${statsRes.status}`);
  } catch (err) {
    report('Admin Dashboard Stats (GET /api/admin/dashboard-stats)', false, err.message);
  }

  // 12. Get Notifications (Admin)
  try {
    const notifsRes = await fetch(`${BASE_URL}/api/notifications`, {
      headers: { 'Cookie': adminCookie }
    });
    const notifsData = await notifsRes.json();
    report('Get Notifications (GET /api/notifications)', notifsRes.status === 200, `Status: ${notifsRes.status}, Success: ${notifsData.success}`);
  } catch (err) {
    report('Get Notifications (GET /api/notifications)', false, err.message);
  }

  // 13. Admin Logout
  try {
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Cookie': adminCookie }
    });
    report('Logout (POST /api/auth/logout)', logoutRes.status === 200, `Status: ${logoutRes.status}`);
  } catch (err) {
    report('Logout (POST /api/auth/logout)', false, err.message);
  }

  console.log('\n======================================');
  console.log(`📊 Test Summary: ${results.passed} Passed, ${results.failed} Failed (Total: ${results.tests.length})`);
  console.log('======================================\n');
}

runTests();
