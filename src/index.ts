import server from "./server";
import config from './config/config'


const start = async () => {
    server.listen(config.port, () => { console.info(`server is running on port ${config.port}`) });

}
start();




