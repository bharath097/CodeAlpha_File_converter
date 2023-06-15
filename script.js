var data= [];
var width= 620;
var height= 800;
var pdfName;
var fileName= '';

const createPDF= document.getElementById('create-pdf');

encodeImageFileAsURL= (element)=>{
    document.getElementById('input-page').style.display= 'none';
    document.getElementById('pdf-page').style.display= 'inline-block';

    const length= element.files.length;
    for(var i=0;i<length;i++){
        let file= element.files[i];
        let pdfname= element.files[0];
        let reader= new FileReader();
        reader.readAsDataURL(file);

        let obj= {
            list: reader,
            fileName: file.name,
            time: new Date().toString() + i
        }

        reader.onloadend= ()=>{
            data= [...data,obj];
            pdfName= pdfname.name
        }
    }

    setTimeout(convertToPDF,1000);
    document.getElementById('upload-file').value= null;
    setTimeout(saveAsPDF,1000);
}


saveAsPDF= ()=>{
    document.getElementById('upload-msg').style.display= 'none';
    document.getElementById('convertBtn').style.display= 'inline-block';
}


//delete item from pdf page
handleDelete= (e)=>{
    data= data.filter((item)=>item.time!==e.currentTarget.id);
    if(data.length==0){
        location.reload();
    }
    else{
        convertToPDF();
    }
}


//initiate file downloading
embedImages= async ()=>{
    const pdfDoc= await PDFLib.PDFDocument.create();
    for(var i=0;i<data.length;i++){
        const jpgUrl= data[i].list.result;
        const jpgImageBytes= await fetch(jpgUrl).then((res) => res.arrayBuffer());

        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);

        //Add a blank page to the document
        const page= pdfDoc.addPage();

        //set page size
        page.setSize(width,height);
        page.drawImage(jpgImage, {
            x: 20,
            y: 50,
            width: page.getWidth()-40,
            height: page.getHeight()-100,
        })
    }

    //save the padf pages
    const pdfBytes= await pdfDoc.save();

    //download pdf file 
    download(pdfBytes, pdfName.slice(0,-4), "application/pdf");

    //back to home page after downloading file
    setTimeout(backToHomepage,1000);
}