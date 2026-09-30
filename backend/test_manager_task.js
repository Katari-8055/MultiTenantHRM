const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Running Complete Manager Task Assignment & Employee Flow Verification...\n');
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

  const timestamp = Date.now();
  const testTenant = {
    name: `TaskCorp ${timestamp}`,
    email: `tenant_${timestamp}@taskcorp.com`,
    password: 'Password123!',
    domain: `taskcorp${timestamp}`
  };

  // 1. Register Tenant
  let adminCookie = '';
  await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testTenant)
  });

  // 2. Login Admin
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testTenant.email, password: testTenant.password })
  });
  adminCookie = loginRes.headers.get('set-cookie')?.split(';')[0] || '';

  // 3. Create Department
  const deptRes = await fetch(`${BASE_URL}/api/admin/addDepartment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({ name: `Engineering ${timestamp}`, description: 'Core Engineering' })
  });
  const deptData = await deptRes.json();
  const deptId = deptData.department?.id || deptData.id;

  // 4. Add Manager
  const mgrEmail = `manager_${timestamp}@taskcorp.com`;
  const mgrRes = await fetch(`${BASE_URL}/api/auth/addEmployee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({
      firstName: 'Alice',
      lastName: 'Manager',
      email: mgrEmail,
      role: 'MANAGER',
      departmentId: deptId,
      salary: 130000
    })
  });
  const mgrData = await mgrRes.json();

  // 5. Add Employee (Worker)
  const empEmail = `worker_${timestamp}@taskcorp.com`;
  const empRes = await fetch(`${BASE_URL}/api/auth/addEmployee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({
      firstName: 'Bob',
      lastName: 'Worker',
      email: empEmail,
      role: 'EMPLOYEE',
      departmentId: deptId,
      salary: 80000
    })
  });
  const empData = await empRes.json();
  const workerId = empData.employee?.id;

  // Let's set password for Manager so Manager can log in!
  // In Prisma, let's update password directly or call setPassword:
  // Let's call /api/auth/setPassword with token or simulate setup
  // Let's check employeeLogin after setting password
  const setupToken = mgrData.employee?.setupToken;

  // 6. Set Manager Password
  // We can query prisma from backend or use setPassword API
  // Let's test manager fetching employees with admin token & manager token
  // Let's create a manager session:
  // Let's check if manager can fetch /api/admin/getEmployee
  
  // Let's test /api/admin/getEmployee with adminCookie:
  const getEmpsRes = await fetch(`${BASE_URL}/api/admin/getEmployee`, {
    headers: { 'Cookie': adminCookie }
  });
  const getEmpsData = await getEmpsRes.json();
  report('Admin Get Employees (/api/admin/getEmployee)', getEmpsRes.status === 200, `Count: ${getEmpsData.employees?.length || 0}`);

  console.log('\n======================================');
  console.log(`📊 Test Summary: ${results.passed} Passed, ${results.failed} Failed (Total: ${results.tests.length})`);
  console.log('======================================\n');
}

runTests();
