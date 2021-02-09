import * as express from 'express';
import { Request, Response } from 'express';
import { Movies } from './routes/movies';
let trequestcounter:number=1;
let urlCount:any={};

class App {
	public app: express.Application;
	public movieRoutes: Movies = new Movies();

	constructor() {
		this.app = express();
		this.config();
		this.movieRoutes.routes(this.app);
	}

	private Logger = (req: Request, res: Response, next: Function) => {
	
        trequestcounter=trequestcounter++;
        console.log("Total requests "+trequestcounter++);

   
        console.log(JSON.stringify(req.body)+" "+req.method+" "+req.originalUrl);
        let url=req.originalUrl

        if(urlCount[url]===undefined){
            urlCount[url]=1;

        }
        else{
            urlCount[url]++;
        }
        console.log(req.originalUrl+"     count of requests       "+urlCount[url]);
		next();
	};

	private config(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(this.Logger);
	}
}

export default new App().app;