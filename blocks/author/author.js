import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));
console.log(placeholders);
const { authorDetails,firstName,lastName,occupation,bio,topics} = placeholders;

export default function decorate(block) {
    const headingDiv=document.createElement('div');
    headingDiv.classList.add("table-heading");
    const htext=document.createTextNode(authorDetails);
    const headingH1=document.createElement('h1');
    headingH1.append(htext);
    headingDiv.append(headingH1);
    
    const table = document.createElement('table');
    let tr=document.createElement("tr");
    //let ad=document.createElement("th");ad.appendChild(document.createTextNode(authorDetails));tr.append(ad);
    let fn=document.createElement("th");fn.appendChild(document.createTextNode(firstName));tr.append(fn);
    let ln=document.createElement("th");ln.appendChild(document.createTextNode(lastName));tr.append(ln);
    let oc=document.createElement("th");oc.appendChild(document.createTextNode(occupation));tr.append(oc);
    let bi=document.createElement("th");bi.appendChild(document.createTextNode(bio));tr.append(bi);
    let to=document.createElement("th");to.appendChild(document.createTextNode(topics));tr.append(to);
    table.append(tr);
    [...block.children].forEach((row,r) => {
        if(r==0){
            let row1=document.createElement("tr");
            [...row.children].forEach((col,c) => {
                let row1Col=document.createElement("th");
                row1Col.appendChild(document.createTextNode(col.textContent));
                row1Col.colSpan=2;
                row1.append(row1Col);
                //console.log(r,col.textContent);
            });
            table.append(row1);
        }else{
            let rowelse=document.createElement("tr");
            [...row.children].forEach((col,c) => {
                let rowelseCol=document.createElement("td");
                //console.log(r,col.textContent);
                rowelseCol.appendChild(document.createTextNode(col.textContent));
                rowelse.append(rowelseCol);
            });
            table.append(rowelse);
        }
    });
    block.innerHTML = '';
    block.append(headingDiv, table);
}