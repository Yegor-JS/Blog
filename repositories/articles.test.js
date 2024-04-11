const Repository = require("./repository");

const articlesRepo = require("./articles");

const { test, describe } = require("node:test");
const assert = require("node:assert");

describe("removePictures", () => {
//   test("should not remove pictures when there are no pictures", async () => {
//     const input = "str";
//     const expected = "str";
//     const actual = await articlesRepo.removePictures(input);
//     assert.equal(actual, expected);
//   });
//   test("should remove small picture", async () => {
//     class FakePicturesRepositories extends Repository {}

//     const FakePictures = new FakePicturesRepositories("testPictures.json");
//     console.log(await FakePictures.getAll())

//     const input = `<figure>
//                     <img src="data:image/png;base64, /9j/4AAQSkZBkAAAAAP/Z"/>
//                     </figure>`;

//     const expected = `\r\n{'picture id' : 82bd71bb }\r\n`;
//     const actual = await articlesRepo.removePictures(input, FakePictures);
//     assert.equal(actual, expected);
//   });
  test("should remove real-like picture without pluses in the image body", async () => {
    class FakePicturesRepositories extends Repository {}

    const FakePictures = new FakePicturesRepositories("testPictures.json");

    const id = '1c010379';
    const picture = await FakePictures.getOneBy({ id })

    const input = `<figure>
                    <img src="data:image/png;base64, ${picture.imageBody}"/>
                    </figure>`;

    const expected = `\r\n{'picture id' : ${id} }\r\n`;
    const actual = await articlesRepo.removePictures(input, FakePictures);
    assert.equal(actual, expected);
  });

  test("should remove real-like picture with pluses in the image body", async () => {
    class FakePicturesRepositories extends Repository {}

    const FakePictures = new FakePicturesRepositories("testPictures.json");

    const id = '4b30911f';
    const picture = await FakePictures.getOneBy({ id })

    const input = `<figure>
                    <img src="data:image/png;base64, ${picture.imageBody}"/>
                    </figure>`;

    const expected = `\r\n{'picture id' : ${id} }\r\n`;
    const actual = await articlesRepo.removePictures(input, FakePictures);
    assert.equal(actual, expected);
  });
});
