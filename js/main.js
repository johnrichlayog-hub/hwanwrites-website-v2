const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));document.querySelector('#year').textContent=new Date().getFullYear();

const inquiryForm=document.querySelector('#inquiry-form');
inquiryForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  const status=document.querySelector('#form-status');
  const button=inquiryForm.querySelector('button[type="submit"]');
  const payload=Object.fromEntries(new FormData(inquiryForm).entries());
  status.textContent='Submitting your inquiry...';
  button.disabled=true;
  try{
    const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||'Unable to submit your inquiry.');
    status.textContent='Thank you! Your inquiry has been submitted successfully. I will get back to you soon.';
    inquiryForm.reset();
  }catch(error){
    status.textContent=error.message||'Something went wrong. Please email hwanwrites.uracadsupport@gmail.com.';
  }finally{
    button.disabled=false;
  }
});

const chat=document.querySelector('#chat');document.querySelector('#chat-launcher')?.addEventListener('click',()=>chat.hidden=!chat.hidden);document.querySelector('#chat-close')?.addEventListener('click',()=>chat.hidden=true);const faqs=[['price|rate|cost|how much','Rates depend on scope, complexity, and deadline. Send your project details for a quotation.'],['service|offer|help','HwanWrites offers research assistance, academic services, professional documents, web development, and graphic design.'],['payment|down payment','A 65% down payment is required before work begins.'],['refund|cancel','Cancellations and refunds are not accepted once work has started.'],['deadline|rush|time','Turnaround depends on the scope and target date. Rush fees may apply.'],['contact|email|instagram|facebook','Email hwanwrites.uracadsupport@gmail.com or message HwanWrites on Facebook / @paybfortritu on Instagram.'],['confidential|privacy','Client details and project files are handled confidentially.']];document.querySelector('#chat-form')?.addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector('#chat-input'),q=input.value.trim();if(!q)return;const area=document.querySelector('#chat-messages'),u=document.createElement('p');u.className='user';u.textContent=q;area.append(u);const match=faqs.find(([keys])=>keys.split('|').some(k=>q.toLowerCase().includes(k)));const a=document.createElement('p');a.className='bot';a.textContent=match?match[1]:'Thanks for asking. Please send an inquiry or email hwanwrites.uracadsupport@gmail.com for assistance.';area.append(a);input.value='';area.scrollTop=area.scrollHeight;});
