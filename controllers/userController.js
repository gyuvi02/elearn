const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const selectedChapter = user.books.find(title=> title.titleBook==='Radiology').chapters.find(title => title.titleChapter === '102');

    console.log(selectedChapter.forms);

    res.status(200).json({
      status: "success",
      data: {

        user
      }
    });

});

exports.createUser = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(newU);
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const selectedBook = user.books.find(title => title.titleBook === 'Radiology');
  // const selectedChapter = selectedBook.chapters.find(title => title.titleChapter === '101');
  const selectedChapter = selectedBook.chapters[0]; //this works when I've just created the user, and in the chapters array there is only one, empty chapter
  const bookIndex = 0;
  const chapterIndex = 0;

    // const user3 = await User.findByIdAndUpdate({_id: req.params.id},
    //   {["books." + bookIndex + ".chapters." + chapterIndex + ".forms.10101"]: "ez a megvaltoztatott szoveg"});

    // req.body = {"books.obj.chapters.0.forms.10101": "minden"};
    // console.log(req.body);

    // const user2 = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    // console.log(selectedChapter.forms.set('10102', 'javitott beiras'));
    // console.log(selectedChapter.set('forms.10101', 'ez a javitott beiras'));

  for (var i = 10101; i < 10105; i++) {
    const modifiedForms = selectedChapter.set('forms.' + i, 'probaljuk ki');
    await User.findByIdAndUpdate({_id: req.params.id},
      {["books." + bookIndex + ".chapters." + chapterIndex]: [modifiedForms]}, {
        new: true
      });
  }

  res.status(200).json({
    status: "success",
    data: {
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
      status: "success"
    });
});
