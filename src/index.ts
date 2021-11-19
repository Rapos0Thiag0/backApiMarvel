import express,{Request,Response,NextFunction} from 'express'
import cors from 'cors'; // previnir erro no heroko
import axios from 'axios'; // Requisiçoes 
import md5 from 'md5';
import 'dotenv/config'
//Chave Marvel
const publicKey = 'b60115b9e7a50dd36c8c4cd76c94be33';
const privateKey = 'ea81bf0a9de7ae4eb4e441bcbb8c2e46f896aa40';
const  urlApi = 'http://gateway.marvel.com/v1/public';


const app = express();


app.use(cors())
app.use(express.json());

const port = process.env.PORT;

app.listen(port,()=>{
    console.log("Servidor executando na porta " + port)
})


app.get("/", (req:Request,res:Response,next:NextFunction)=>{
    //limite nao pode ser menor que 1 ou maior que 100
    //pagina 
    const {page,limit} = req.query; //vai receber a pagina atual e o limite de exibição

    const ts = new Date().getTime().toString();
    const hash = md5(ts + privateKey + publicKey)

    axios.get(`${urlApi}/characters`,{
        params:{
            ts:ts,
            apikey: publicKey,
            hash: hash,
            orderBy: 'name',
            limit: 20,
            offset: Number(limit) * Number(page)
        }
    }).then((response => {

       const personagens:Array<any> = response.data.data.results;
       const nomes:Array<any> = personagens.map(personagem => personagem.name)

        res.json(nomes);
    })).catch(err =>{
        res.status(500).send('erro interno');
    })
})


