import { getCourses, addCourse, removeCourse } from "./courses.js";

const get = async () => {
  console.log("Les cours disponibles sont:");
  const list = await getCourses();
  list.map((x) => {
    console.log("  " + x.nom + "(" + x._id + ")");
  });
};

const add = async (cours) => {
  addCourse(cours);
  console.log("Cours " + cours + " bien ajouté à la liste");
};

const remove = async (id) => {
  try {
    removeCourse(id);
    console.log("Cours bien supprimé de la liste");
  } catch {
    console.log("Le cours n'existe pas.");
  }
};

if (process.argv[2] == "get") get();
if (process.argv[2] == "add") add(process.argv[3]);
if (process.argv[2] == "remove") remove(process.argv[3]);
