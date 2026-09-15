from pydantic import BaseModel, field_validator


class Trilang(BaseModel):
    es: str
    en: str
    pt: str


class Question(BaseModel):
    q: Trilang
    options: list[Trilang]
    answer: int
    explain: Trilang
    difficulty: str  # basico|medio|avanzado

    @field_validator("options")
    @classmethod
    def four(cls, v):
        if len(v) != 4:
            raise ValueError("4 opciones")
        return v

    @field_validator("answer")
    @classmethod
    def answer_in_range(cls, v):
        if not (0 <= v <= 3):
            raise ValueError("answer must be between 0 and 3")
        return v


class Lesson(BaseModel):
    id: str
    type: str
    title: Trilang
    content: Trilang
    duration_min: int = 15
    bullets: list[Trilang] = []
    quiz: list[Question] = []


class Module(BaseModel):
    id: str
    title: Trilang
    lessons: list[Lesson]


class Course(BaseModel):
    slug: str
    title: Trilang
    desc: Trilang
    modules: list[Module]


class Program(BaseModel):
    slug: str
    title: Trilang
    courses: list[Course]
