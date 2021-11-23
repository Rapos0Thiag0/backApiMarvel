import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // previnir erro no heroko
import axios from "axios"; // Requisiçoes
import md5 from "md5";
import "dotenv/config";
//Chave Marvel
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const urlApi = "http://gateway.marvel.com/v1/public/characters";

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Servidor executando na porta " + port);
});

app.get("/personagens", (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.query;
  const { limit } = req.query;

  const ts = new Date().getTime().toString();
  const hash = md5(ts + privateKey + publicKey);

  axios
    .get(`${urlApi}?`, {
      params: {
        ts: ts,
        apikey: publicKey,
        hash: hash,
        orderBy: "name",
        limit: limit,
        offset: Number(limit) * Number(page),
      },
    })
    .then((response) => {
      const personagens: Array<any> = response.data.data.results;
      const nomes: Array<any> = personagens.map((nomes) => {
        return {
          nome: nomes.name,
          id: nomes.id,
          image: nomes.thumbnail,
        };
      });
      const objRetorno = {
        page: page,
        count: nomes.length,
        totalPages: response.data.data.total / Number(limit),
        personagens: [...nomes],
      };
      res.json(objRetorno);
    })
    .catch((err) => {
      res.status(500).send("Erro interno");
    });
});

// app.get("/personagens/:id", (req: Request, res: Response) => {
//   const ts = new Date().getTime().toString();
//   const hash = md5(ts + privateKey + publicKey);
//   const { id } = req.params;

//   axios
//     .get(`${urlApi}/characters/${id}`, {
//       params: {
//         ts: ts,
//         apikey: publicKey,
//         hash: hash,
//       },
//     })
//     .then((response) => {
//       const personagem: Array<any> = response.data.data.results;
//       const personagemAtributos: Array<any> = personagem.map((personagem) => {
//         return {
//           nome: personagem.name,
//           descricao: personagem.description,
//           id: personagem.id,
//           image: personagem.thumbnail,
//           comics: personagem.comics,
//         };
//       });
//       res.send(personagemAtributos);
//     })
//     .catch((err) => {
//       res.status(500).send("Erro interno");
//     });
// });

app.get("/personagens/:id", (req: Request, res: Response) => {
  const ts = new Date().getTime().toString();
  const hash = md5(ts + privateKey + publicKey);
  const { id } = req.params;
  axios
    .get(`${urlApi}/${id}/comics?`, {
      params: {
        ts: ts,
        apikey: publicKey,
        hash: hash,
      },
    })
    .then((response) => {
      const personagem: Array<any> = response.data.data.results;
      const personagemAtributos: Array<any> = personagem.map((personagem) => {
        return {
          nome: personagem.title,
          image: personagem.thumbnail,
        };
      });
      console.log(personagemAtributos);
      res.send(personagemAtributos);
    })
    .catch((err) => {
      res.status(500).send("Erro interno");
    });
});
