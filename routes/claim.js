/* import express from "express";

import Claim from "../models/claim.js";
const router = express.Router();
router.post("/", async(req, res) => {
    const claim = req.body;

    const newClaim = new Claim(claim);
    try {
        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (error) {
        res.status(409).json(error);
    }
}); */




/* export default router */