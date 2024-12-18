import type { ExpensesParser } from "@prisma/client";
import { IncomingForm, type Fields, type Files } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { VividPdfExpensesParser } from "~/server/ExpensesParser/VividPdfExpensesParser";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    // Return error
    res.status(405).json("Method not allowed for File Upload");
  }
  // Do your authentication magic here first
  // Get the headers using req.headers.<header name> ....
  try {
    const data: { files: Files<string> } = await new Promise(
      (resolve, reject) => {
        const form = new IncomingForm({});
        form.parse(
          req,
          (
            err: Error | undefined,
            fields: Fields<string>,
            files: Files<string>
          ) => {
            if (err) {
              reject(err);
            }
            resolve({ files });
          }
        );
      }
    );

    const file = data.files["pdf-expenses"]?.[0];
    if (file) {
      if (req.query.parser === undefined || req.query.parser === "") {
        res.status(400).json("Parser query param is required");
        return;
      }
      if ((req.query.parser as ExpensesParser) === "VIVID") {
        const parser = new VividPdfExpensesParser(file.filepath);
        const rows = await parser.parse();
        res.status(200).json(rows);
      } else {
        res.status(400).json(`Invalid parser: ${String(req.query.parser)}`);
      }
    }

    res.status(500).json("Error while parsing the file");
  } catch (error: unknown) {
    console.error(error);
    res
      .status(500)
      .json(error instanceof Error ? error.message : "Unknown error");
  }
}

export default handler;
