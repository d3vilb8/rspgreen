import{r as l,j as e,b as n}from"./app-DecQ0f_S.js";import{o as i,p as x}from"./index-BPKSu1J7.js";import{N as p}from"./notyf.min-DLu_xjpT.js";import"./iconBase-DWhxbjqT.js";const d=new p,f=({salary:t})=>{const[m,o]=l.useState([]);console.log("jhgf",t),l.useEffect(()=>{(async()=>{const r=await n.get("/salaries");o(r.data.salaries)})()},[]);function a(s){s==="sms"?d.error("Please configure your sms api!"):d.error("Please configure your mail setup!")}return e.jsxs("div",{className:"w-[70%] mt-8 shadow-[rgba(60,64,67,0.3)_0px_1px_2px_0px,rgba(60,64,67,0.15)_0px_2px_6px_2px] p-4",children:[e.jsx("h3",{className:"text-2xl font-semibold mb-4",children:"Salary list"}),e.jsx("div",{className:"overflow-x-auto w-full",children:e.jsxs("table",{className:"min-w-full border border-gray-300 bg-white shadow-md",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100",children:[e.jsx("th",{className:"p-3 text-left border",children:"Sl"}),e.jsx("th",{className:"p-3 text-left border",children:"Salary Name"}),e.jsx("th",{className:"p-3 text-left border",children:"Generate Date"}),e.jsx("th",{className:"p-3 text-left border",children:"Generate By"}),e.jsx("th",{className:"p-3 text-left border",children:"Approved Date"}),e.jsx("th",{className:"p-3 text-left border",children:"Approved By"}),e.jsx("th",{className:"p-3 text-left border",children:"Action"})]})}),e.jsx("tbody",{children:t==null?void 0:t.map((s,r)=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 border",children:r+1}),e.jsx("td",{className:"p-3 border",children:s.salary_name}),e.jsx("td",{className:"p-3 border",children:s.generate_date}),e.jsx("td",{className:"p-3 border",children:s.generate_by}),e.jsx("td",{className:"p-3 border",children:s.approved_date||"N/A"}),e.jsx("td",{className:"p-3 border",children:s.approved_by||"N/A"}),e.jsxs("td",{className:"space-x-2",children:[" ",e.jsx("button",{type:"button",onClick:c=>a("mail"),className:"px-2 py-2 bg-green-500 rounded text-white",children:e.jsx(i,{})}),e.jsx("button",{type:"button",onClick:c=>a("sms"),className:"px-2 py-2 bg-indigo-500 rounded text-white",children:e.jsx(x,{})})]})]},s.id))})]})})]})};export{f as default};
