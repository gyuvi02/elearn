const catchAsync = require('./../utils/catchAsync');
const Ebook = require('./../models/ebookModel')
const factory = require('./../controllers/handlerFactory');

exports.getEbook = catchAsync(async (req, res, next) => {
  const ebook = await Ebook.findById(req.params.id);
  if (!ebook) {
    return next(new AppError('No ebook found with that ID', 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      cover: ebook.coverPhoto,
      title: ebook.titleBook,
      summary: ebook.summaryEbook
    }
  });
  }); //no details, just an overview of the book
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

