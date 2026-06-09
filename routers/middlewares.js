const usersRepo = require("../repositories/users");
const { validationResult } = require("express-validator");

module.exports = {
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }
    next();
  },

  async requireAdmin(req, res, next) {
    const id = req.session.userId;
    const user = await usersRepo.getOneBy({ id });
    if (!user.admin) {
      return res.redirect("/signin");
    }
    next();
  },

  async requireLength(req, res, next) {
    const comment = req.body.comment;
    if (comment.length < 1) {
      return res
        .status(400)
        .send({ error: "Your comment must contain at least some characters" });
    }
    if (comment.length > 2000) {
      return res.status(400).send({
        error:
          "Your comment is too long. Please, keep it no longer than 2000 characters",
      });
    }
    if (!comment.length) {
      return res.status(500).send({ error: "Something went wrong" });
    }
    next();
  },

  async requireImage(req, res, next) {
    const image = req.file;

    const checkExtension = () => {
      if (
        req.file.mimetype != "image/png" &&
        req.file.mimetype != "image/jpeg"
      ) {
        return false;
      } else {
        return true;
      }
    };
    // console.log("checkExtension", checkExtension());

    const isPng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]).equals(image.buffer.subarray(0, 8));

    const isJfif = Buffer.from([0xff, 0xd8, 0xff, 0xe0]).equals(
      image.buffer.subarray(0, 4),
    );

    const isExif = Buffer.from([0xff, 0xd8, 0xff, 0xe1]).equals(
      image.buffer.subarray(0, 4),
    );

    const checkBuffer = () => {
      if (!isPng && !isJfif && !isExif) {
        return false;
      } else {
        return true;
      }
    };
    // console.log(isPng, isJfif, isExif);
    // console.log("buffer", checkBuffer());
    // console.log("checkExtension", checkExtension());

    // const checkBuffer = () => {
    //   const signatures = {
    //     pngSignature: Buffer.from([
    //       0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    //     ]),
    //     jfifSignature: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    //     exifSignature: Buffer.from([0xff, 0xd8, 0xff, 0xe1]),
    //   };
    //   let ifSignatureMatches = false;

    //   THE PROBLEM IS WE MUST MATCH ONLY THE FIRST 4 BYTES IF IT'S NOT A PNG, SO PROBABLY IT'S MORE EFFICIENT TO NOT ITERATE

    //   const inputBuffer = image.buffer.subarray(0, 8);

    //   Object.keys(signatures).forEach(function (key) {
    //     console.log("signatures", ifSignatureMatches);
    //     console.log("input buffer", inputBuffer)
    //     if (inputBuffer.equals(signatures[key])) {
    //       ifSignatureMatches = true;
    //     }
    //   });
    //   return ifSignatureMatches;
    // };

    if (!checkExtension() || !checkBuffer()) {
      return (
        res
          .status(415)
          // There's no message sent because the error code above describes it all very well
          .send()
      );
    }
    next();
  },

  handleErrors(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }

        return res.send(templateFunc({ errors, ...data }));
      }
      next();
    };
  },
};
