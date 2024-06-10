const Header = ({ course }) => {
  return (
    <>
      <h1>{course}</h1>
    </>
  );
};

const Content = ({ parts }) => {
  return parts.map(part => <Part key={part.name} part={part.name} exercises={part.exercises} />);
};

const Part = ({ part, exercises }) => {
  return (
    <>
      <p>
        {part}: {exercises}
      </p>
    </>
  );
};

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <>
      <p>Number of exercises: {total}</p>
    </>
  );
};

const Courses = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const Course = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => (
        <Courses key={course.id} course={course} />
      ))}
    </div>
  );
};
export default Course;
