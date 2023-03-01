// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Product } from "../../server/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const products = await Product.findAll();
      console.log(products)
      res.json(products);
    } catch (err) {
      res.status(501).json({ error: err.message });
    }
  }
    if (req.method === 'POST') {
      try {
        console.log(req.body);
        const product = await Product.create(req.body);
        res.status(201).json(product);
      }
      catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
}
