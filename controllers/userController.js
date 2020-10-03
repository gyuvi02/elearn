const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("../utils/appError");
const createSendToken = require('./../utils/createSendToken');
const factory = require('./../controllers/handlerFactory');
const Ebook = require("../models/ebookModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  })
  return newObj;
};

exports.deleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User,
  {path: 'courses', select: {'__v': 0, '_id': 0, 'chapters': 0}});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  console.log(req.params.id);

  next();
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().populate({
      path: 'courses',
      select: {'__v': 0, '_id': 0, 'chapters': 0, 'coverPhoto': 0}
    });

    res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update. Please use /updatemypassword', 400));
  }
  //Update user document
  const filteredBody = filterObj(req.body,'firstName', 'lastName', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});

  createSendToken(updatedUser, 200, res);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     user: updatedUser
  //   }
  // });
});


//We use authController.signup instead
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

  let actualCourse;
  let actualBook;
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  //--------------------ADDING NEW COURSE TO THE COURSES ARRAY ------------------------------------
  if (req.body.courses) {
    const newCourse = await Ebook.findOne({titleBook: req.body.courses}, () =>  {});
    if (newCourse && !user.courses.includes(newCourse.id)) { //we can add the course only once
      user.courses.push(newCourse.id);
      console.log(`req.body.courses: ${req.body.courses}`);
      user.courseParticipants.push({courseName: req.body.courses}); //as a new course was added, we can add this course to courseParticipants array at once
    }
  }

  //--------------------ADDING NEW COURSE TO THE COURSEPARTICIPANTS ARRAY ------------------------------------
  // if (req.body.courseParticipants && req.body.courseParticipants.courseName) {
  //   console.log(`)Van courseName`);
  //   actualCourse = req.body.courseParticipants.courseName; //courseName is chosen from a list of already existing courses for this user, so it must exist in the courseParticipants array
  //   if (!user.courseParticipants.some(x => x.courseName === actualCourse)) { //if it doesn't exist, we add it as a new course
  //     user.courseParticipants.push(req.body.courseParticipants);
  //   } else  {

      //-------------------ADDING NEW EMAIL TO THE PARTICIPANTS ARRAY -----------------------------------
  if (req.body.courseParticipants && req.body.courseParticipants.participants && req.body.courseParticipants.courseName) {
    actualCourse = req.body.courseParticipants.courseName; //courseName is chosen from a list of already existing courses for this user, so it must exist in the courseParticipants array
    const actualIndex = user.courseParticipants.findIndex(x => x.courseName === actualCourse);
    if (!user.courseParticipants[actualIndex].participants.includes(req.body.courseParticipants.participants)){ //we can't add a user's email twice
      user.courseParticipants[actualIndex].participants.push(req.body.courseParticipants.participants);
    }
  }

  //---------------------------- ADDING NEW EBOOK ----------------------------------------------
  if (req.body.books) {
    actualBook = req.body.books.titleBook;
    if (!user.books.some(x => x.titleBook === actualBook)) {
      user.books.push(req.body.books);
    } else if (req.body.books.chapters) {
      //-------------------UPDATING AN EXISTING BOOK ADD NEW BOOK -----------------------------------
      const bookIndex = user.books.findIndex(x => x.titleBook === actualBook);
      //actually we don't want to add new chapters or even check the existence here in producton (if I do a relatively good job) because:
      //a) we should upload all the (empty) chapters when we create the book from some sort of book template, and
      //b) the PATCH will send back a chapter with the forms, and it cannot be different from the uploaded book template (see point a)

      // if (!user.books[bookIndex].chapters.some(z => z.titleChapter === req.body.books[bookIndex].chapters.titleChapter)) {
      //   user.books[bookIndex].chapters.push(req.body.books[bookIndex].chapters.titleChapter);
      // }else{
      const actualChapter = req.body.books.chapters.titleChapter;
      const chapterIndex = user.books[bookIndex].chapters.findIndex(y => y.titleChapter = actualChapter);
      user.books[bookIndex].chapters[chapterIndex] = req.body.books[bookIndex].chapters[chapterIndex];
      // console.log(user.books[bookIndex].chapters[chapterIndex]);
    }
  }

    // const selectedBook = user.books.find(title => title.titleBook === 'Radiology');
  // const selectedChapter = selectedBook.chapters.find(title => title.titleChapter === '101');
  // const selectedChapter = selectedBook.chapters[0]; //this works when I've just created the user, and in the chapters array there is only one, empty chapter
  // const bookIndex = 0;
  // const chapterIndex = 0;

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

  // for (var i = 10101; i < 10105; i++) {
  //   const modifiedForms = selectedChapter.set('forms.' + i, 'probaljuk ki');
  //   await User.findByIdAndUpdate({_id: req.params.id},
  //     {["books." + bookIndex + ".chapters." + chapterIndex]: [modifiedForms]}, {
  //       new: true
  //     });
  // }

  await User.findByIdAndUpdate(req.params.id, user);
  res.status(200).json({
    status: "success",
    data: {
    }
  });
});

exports.addCourse = catchAsync( async (req, res, next) => {

})


