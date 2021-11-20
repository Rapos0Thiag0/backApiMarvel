import express,{Request,Response,NextFunction} from 'express'
import cors from 'cors'; // previnir erro no heroko
import axios from 'axios'; // Requisiçoes 
import md5 from 'md5';
import 'dotenv/config'
//Chave Marvel
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const  urlApi = 'http://gateway.marvel.com/v1/public';


const app = express();


app.use(cors())
app.use(express.json());

const port = process.env.PORT;

app.listen(port,()=>{
    console.log("Servidor executando na porta " + port)
})


app.get('/', (req: Request,res: Response, next: NextFunction)=>{
    
    const { page } = req.body;
    const { limit } = req.body;

    console.log(Number(page));
    console.log(Number(limit));
    // const limit:number = 30//Number(req.query.limit)
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
       const nomes:Array<any> = personagens.map(nomes => {
           return {
               nome: nomes.name,
               id: nomes.id
           }
       });
       const objRetorno = {
        page: page,
        count: nomes.length,
        totalPages: response.data.data.total/limit,
        personagens: [... nomes]
   }
    res.json(objRetorno)
    })).catch(err =>{
        res.status(500).send('erro interno');
    })
})