import{r as i,j as e}from"./app-DecQ0f_S.js";const o=({isOpen:t,onClose:a,onSave:n})=>{if(!t)return null;const r=l=>{l.preventDefault();const s=new FormData(l.target),d=Object.fromEntries(s);n(d)};return e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center",children:e.jsxs("div",{className:"bg-white rounded-lg w-[400px] p-6",children:[e.jsxs("div",{className:"flex justify-between items-center border-b pb-2 mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Create Commission"}),e.jsx("button",{className:"text-gray-500 hover:text-black",onClick:a,children:"×"})]}),e.jsxs("form",{onSubmit:r,children:[e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{htmlFor:"title",className:"block text-sm font-medium mb-1",children:["Title ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",name:"title",id:"title",className:"w-full p-2 border border-gray-300 rounded",required:!0})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{htmlFor:"type",className:"block text-sm font-medium mb-1",children:["Type ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("select",{name:"type",id:"type",className:"w-full p-2 border border-gray-300 rounded",required:!0,children:[e.jsx("option",{value:"Fixed",children:"Fixed"}),e.jsx("option",{value:"Percentage",children:"Percentage"})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{htmlFor:"amount",className:"block text-sm font-medium mb-1",children:["Amount ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"number",name:"amount",id:"amount",className:"w-full p-2 border border-gray-300 rounded",required:!0})]}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx("button",{type:"button",onClick:a,className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Cancel"}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-teal-600",children:"Save Changes"})]})]})]})})},m=()=>{const[t,a]=i.useState([]),[n,r]=i.useState(!1),l=s=>{a([...t,s]),r(!1)};return e.jsxs("div",{className:"bg-white shadow-md rounded-lg p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Commissions"}),e.jsx("button",{className:"bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center",onClick:()=>r(!0),children:"+"})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"min-w-full text-sm border-collapse border border-gray-300",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100",children:[e.jsx("th",{className:"p-2 border border-gray-300",children:"TITLE"}),e.jsx("th",{className:"p-2 border border-gray-300",children:"TYPE"}),e.jsx("th",{className:"p-2 border border-gray-300",children:"AMOUNT"})]})}),e.jsx("tbody",{children:t.map((s,d)=>e.jsxs("tr",{children:[e.jsx("td",{className:"p-2 border border-gray-300",children:s.title}),e.jsx("td",{className:"p-2 border border-gray-300",children:s.type}),e.jsx("td",{className:"p-2 border border-gray-300",children:s.amount})]},d))})]})}),e.jsx(o,{isOpen:n,onClose:()=>r(!1),onSave:l})]})};export{m as default};