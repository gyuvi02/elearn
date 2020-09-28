const catchAsync = require('./../utils/catchAsync');
const Ebook = require('./../models/ebookModel')
const factory = require('./../controllers/handlerFactory');

exports.getEbook = factory.getOne(Ebook);
exports.deleteEbook = factory.deleteOne(Ebook);

exports.getUserEbooks = catchAsync(async (req, res) => {
    const ebook = await Ebook.find({_id: req.user.courses}).select('titleBook');
    res
        .status(200)
        .json({
            message: `Request date for the ebooks of ${req.user.firstName} is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`,
            data: {
                ebook
            }
        })
});

exports.createEbook = catchAsync (async (req, res) => {
    const newEbook = await Ebook.create(req.body);
    res.status(201).json({
        status: 'success',
          data: {
            user: newEbook
        }
    });
});

exports.updateEbook = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: `The data in ebook ${req.params.id} was modified`
    })
};

