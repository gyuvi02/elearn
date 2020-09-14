const User = require('./../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
  } catch (err){
    res.status(404).json({
      status: "failed",
      message: err
    })
  }
};

exports.getUser = async (req, res) => {
  try{

    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {

        user
      }
    });
  }catch (err){
    res.status(404).json({
      status: 'failed',
      message: err.toString()
    });
  }
};

exports.createUser = async (req, res) => {
  try{
    const newU = new User({
      firstName: "Valami",
      lastName: "Szabo",
      role: "user",
      email: "illes2@email.com",
      course: "Radiology",
      books: [
        {
          titleBook: "Radiology",
          chapters: [
            {
              titleChapter: "101",
              forms: {
                10101: "beiras",
                10102: "masik beiras",
                10103: "harmadik beiras"
              }
            },
            {
              titleChapter: "102",
              forms: {
                10201: "beiras",
                10202: "masik beiras",
                10203: "harmadik beiras"
              }
            }
          ]
        }
      ]
    });

    const newUser = await User.create(newU);
    // const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  }catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent'
    })
  }
};

exports.updateUser = async (req, res) => {
  try {
    const fin = req.params.id;
    const update = req.body;
    const user = await User.findByIdAndUpdate(fin, update, {
      new: true,
      runValidators: true
    });

    console.log(user.chapters[0].forms.set('10102', 'javitott beiras'));

    res.status(200).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (err){
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success"
    });
  } catch (err){
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }
};
