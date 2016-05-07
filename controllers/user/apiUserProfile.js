"use strict";

module.exports= function(req,res){
    res.status(200).json(req.decoded);
};