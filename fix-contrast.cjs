const fs = require('fs');
const path = require('path');

const fixClasses = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix global text colors for light mode (not button specific yet)
  content = content.replace(/text-slate-100/g, 'text-slate-800');
  content = content.replace(/text-slate-300/g, 'text-slate-600');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  
  // Specific backgrounds for inputs and cards
  content = content.replace(/bg-white\/5/g, 'bg-white');
  content = content.replace(/bg-white\/10/g, 'bg-slate-100');
  content = content.replace(/border-white\/10/g, 'border-slate-200');
  content = content.replace(/border-white\/15/g, 'border-slate-200');
  content = content.replace(/border-emerald-500\/30/g, 'border-emerald-200');
  content = content.replace(/bg-rose-950\/20/g, 'bg-rose-50');
  content = content.replace(/bg-slate-100/g, 'bg-white');
  
  // SettingsView wrapper and headers
  content = content.replace(/text-white/g, 'text-slate-900');
  
  // BUT we must restore text-white for specific buttons/pills that are emerald or rose
  content = content.replace(/bg-gradient-to-r from-emerald-500 to-emerald-500 text-slate-900/g, 'bg-emerald-500 text-white');
  content = content.replace(/bg-emerald-500 text-slate-900/g, 'bg-emerald-500 text-white');
  content = content.replace(/from-rose-500 to-pink-500 text-slate-900/g, 'from-rose-500 to-pink-500 text-white');
  content = content.replace(/bg-rose-500 text-slate-900/g, 'bg-rose-500 text-white');
  content = content.replace(/from-emerald-500 via-emerald-500 to-cyan-500 text-slate-900/g, 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white');
  content = content.replace(/bg-slate-900\/90 text-slate-900/g, 'bg-slate-900 text-white');
  content = content.replace(/text-emerald-200/g, 'text-emerald-700');
  
  fs.writeFileSync(filePath, content, 'utf8');
};

const components = [
  'src/components/Settings/SettingsView.tsx',
  'src/components/Common/Modal.tsx',
  'src/components/Common/ToastContainer.tsx',
  'src/components/Settlement/GraphVisualizer.tsx',
  'src/components/Auth/LandingAuthView.tsx',
  'src/components/Expense/ExpensesView.tsx',
  'src/components/Expense/QuickAddModal.tsx',
  'src/components/Groups/GroupsView.tsx',
  'src/components/Layout/BottomNav.tsx',
  'src/components/Settlement/SettlementView.tsx'
];

components.forEach(c => fixClasses(path.join(__dirname, c)));
console.log('Fixed contrast classes');
