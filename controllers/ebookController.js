

exports.getAllEbooks = (req, res) => {
    res
        .status(200)
        .json({message: `Request date for all ebooks is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`})
};

exports.getEbook = (req, res) => {
    res
        .status(200)
        .json({
            status: "success",
            data: req.params.id
        })
};

exports.createEbook = (req, res) => {
    res.status(201);
    console.log(req.body);
    res.send(req.body)
};

exports.updateEbook = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: `The data in ebook ${req.params.id} was modified`
    })
};

exports.deleteEbook = (req, res) => {
    res.status(204).json({
        status: 'success',
    })
};
