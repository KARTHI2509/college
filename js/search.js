// Live Client-Side Search Filters for Courses, Departments, and Faculty

document.addEventListener('DOMContentLoaded', () => {
    initLiveSearch();
});

function initLiveSearch() {
    // 1. Search for Courses
    const courseSearchInput = document.querySelector('#course-search-input');
    const courseFilters = document.querySelectorAll('.course-filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    if (courseSearchInput || courseFilters.length > 0) {
        const filterCourses = () => {
            const query = courseSearchInput ? courseSearchInput.value.toLowerCase().trim() : '';
            const activeFilterBtn = document.querySelector('.course-filter-btn.active');
            const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

            courseCards.forEach(card => {
                const title = card.querySelector('.course-title').textContent.toLowerCase();
                const tags = card.getAttribute('data-category') || '';
                const textMatch = title.includes(query);
                const categoryMatch = activeCategory === 'all' || tags.split(',').includes(activeCategory);

                if (textMatch && categoryMatch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        if (courseSearchInput) {
            courseSearchInput.addEventListener('input', filterCourses);
        }

        courseFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                courseFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterCourses();
            });
        });
    }

    // 2. Search for Faculty
    const facultySearchInput = document.querySelector('#faculty-search-input');
    const facultyFilters = document.querySelectorAll('.faculty-filter-btn');
    const facultyCards = document.querySelectorAll('.faculty-card-container'); // Container around the column card

    if (facultySearchInput || facultyFilters.length > 0) {
        const filterFaculty = () => {
            const query = facultySearchInput ? facultySearchInput.value.toLowerCase().trim() : '';
            const activeFilterBtn = document.querySelector('.faculty-filter-btn.active');
            const activeDept = activeFilterBtn ? activeFilterBtn.getAttribute('data-dept') : 'all';

            facultyCards.forEach(card => {
                const name = card.querySelector('.faculty-name').textContent.toLowerCase();
                const designation = card.querySelector('.faculty-designation').textContent.toLowerCase();
                const research = card.querySelector('.faculty-research-text')?.textContent.toLowerCase() || '';
                const dept = card.getAttribute('data-dept') || '';

                const textMatch = name.includes(query) || designation.includes(query) || research.includes(query);
                const deptMatch = activeDept === 'all' || dept === activeDept;

                if (textMatch && deptMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        if (facultySearchInput) {
            facultySearchInput.addEventListener('input', filterFaculty);
        }

        facultyFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                facultyFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterFaculty();
            });
        });
    }

    // 3. Search for Departments
    const deptSearchInput = document.querySelector('#dept-search-input');
    const deptCards = document.querySelectorAll('.department-card');

    if (deptSearchInput) {
        deptSearchInput.addEventListener('input', () => {
            const query = deptSearchInput.value.toLowerCase().trim();

            deptCards.forEach(card => {
                const name = card.querySelector('.department-name').textContent.toLowerCase();
                const desc = card.querySelector('.department-desc').textContent.toLowerCase();
                const match = name.includes(query) || desc.includes(query);

                if (match) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}
