


// client\public\images\cpp.png
export default function ReturnImageFile(fileAccept) {
    console.log(fileAccept)
    return `../../public/images/${fileAccept}.png`;    
}