import * as express from "express";
import * as bodyParser from "body-parser";
import * as bcrypt from "bcryptjs";

import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

// Routes
import { userRouter } from "./routes/userRouter";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // Routes
    app.use("/user", userRouter);

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    const users = await AppDataSource.getRepository(User).find();
    if (users.length < 1) {
      try {
        let pass = await bcrypt.hashSync("toto", 10);
        await AppDataSource.manager.save(
          AppDataSource.manager.create(User, {
            name: "Toto",
            email: "toto@toto.toto",
            password: pass,
          })
        );

        pass = await bcrypt.hashSync("tata", 10);
        await AppDataSource.manager.save(
          AppDataSource.manager.create(User, {
            name: "Tata",
            email: "tata@tata.tata",
            password: pass,
          })
        );
      } catch {
        console.log("error mock users");
      }
    }

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
