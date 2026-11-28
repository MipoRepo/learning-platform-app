// Kurssiruudukko on palvelinkomponentti. Se saa kurssilistan propsina
// ja vastaa vain responsiivisesta asettelusta. Yksittäinen kortti on
// asiakaskomponentti, koska se tarvitsee kielikontekstin.

import type { CourseManifest } from "@/lib/types";
import { CourseCard } from "./CourseCard";

type CourseGridProps = {
    courses: CourseManifest[];
};

export function CourseGrid({ courses }: CourseGridProps) {
    return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
                <li key={course.course_id} className="h-full">
                    <CourseCard course={course} />
                </li>
            ))}
        </ul>
    );
}
