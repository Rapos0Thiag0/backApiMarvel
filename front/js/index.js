

let url = "localhost:2900/";
let tbody = document.querySelector("tbody")

function listaPersonagens(){
    //requisição
    axios.get(url).then((res) => {
            //tbody.innerHTML = "";
            // res.data.personagens.forEach(personagem => {
            //     tbody.innerHTML += `
            //     <tr>
            //         <td>${personagem.id}</td>
            //         <td>${personagem.nome}</td>
            //     </tr> `
            //});

            console.log(res.json());

        })
}
listaPersonagens();