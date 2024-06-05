import { Autocomplete, Button } from '@mui/joy'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function CreateGroups() {
    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
            label: 'The Lord of the Rings: The Return of the King',
            year: 2003,
        },
        { label: 'The Good, the Bad and the Ugly', year: 1966 },
        { label: 'Fight Club', year: 1999 },
        {
            label: 'The Lord of the Rings: The Fellowship of the Ring',
            year: 2001,
        },
        {
            label: 'Star Wars: Episode V - The Empire Strikes Back',
            year: 1980,
        },
        { label: 'Forrest Gump', year: 1994 },
        { label: 'Inception', year: 2010 },
        {
            label: 'The Lord of the Rings: The Two Towers',
            year: 2002,
        },
        { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { label: 'Goodfellas', year: 1990 },
        { label: 'The Matrix', year: 1999 },
        { label: 'Seven Samurai', year: 1954 },
        {
            label: 'Star Wars: Episode IV - A New Hope',
            year: 1977,
        },
        { label: 'City of God', year: 2002 },
        { label: 'Se7en', year: 1995 },
        { label: 'The Silence of the Lambs', year: 1991 },
        { label: "It's a Wonderful Life", year: 1946 },
        { label: 'Life Is Beautiful', year: 1997 },
        { label: 'The Usual Suspects', year: 1995 },
        { label: 'Léon: The Professional', year: 1994 },
        { label: 'Spirited Away', year: 2001 },
        { label: 'Saving Private Ryan', year: 1998 },
        { label: 'Once Upon a Time in the West', year: 1968 },
        { label: 'American History X', year: 1998 },
        { label: 'Interstellar', year: 2014 },
        { label: 'Casablanca', year: 1942 },
        { label: 'City Lights', year: 1931 },
        { label: 'Psycho', year: 1960 },
        { label: 'The Green Mile', year: 1999 },
        { label: 'The Intouchables', year: 2011 },
        { label: 'Modern Times', year: 1936 },
        { label: 'Raiders of the Lost Ark', year: 1981 },
        { label: 'Rear Window', year: 1954 },
        { label: 'The Pianist', year: 2002 },
        { label: 'The Departed', year: 2006 },
        { label: 'Terminator 2: Judgment Day', year: 1991 },
        { label: 'Back to the Future', year: 1985 },
        { label: 'Whiplash', year: 2014 },
        { label: 'Gladiator', year: 2000 },
        { label: 'Memento', year: 2000 },
        { label: 'The Prestige', year: 2006 },
        { label: 'The Lion King', year: 1994 },
        { label: 'Apocalypse Now', year: 1979 },
        { label: 'Alien', year: 1979 },
        { label: 'Sunset Boulevard', year: 1950 },
        {
            label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
            year: 1964,
        },
        { label: 'The Great Dictator', year: 1940 },
        { label: 'Cinema Paradiso', year: 1988 },
        { label: 'The Lives of Others', year: 2006 },
        { label: 'Grave of the Fireflies', year: 1988 },
        { label: 'Paths of Glory', year: 1957 },
        { label: 'Django Unchained', year: 2012 },
        { label: 'The Shining', year: 1980 },
        { label: 'WALL·E', year: 2008 },
        { label: 'American Beauty', year: 1999 },
        { label: 'The Dark Knight Rises', year: 2012 },
        { label: 'Princess Mononoke', year: 1997 },
        { label: 'Aliens', year: 1986 },
        { label: 'Oldboy', year: 2003 },
        { label: 'Once Upon a Time in America', year: 1984 },
        { label: 'Witness for the Prosecution', year: 1957 },
        { label: 'Das Boot', year: 1981 },
        { label: 'Citizen Kane', year: 1941 },
        { label: 'North by Northwest', year: 1959 },
        { label: 'Vertigo', year: 1958 },
        {
            label: 'Star Wars: Episode VI - Return of the Jedi',
            year: 1983,
        },
        { label: 'Reservoir Dogs', year: 1992 },
        { label: 'Braveheart', year: 1995 },
        { label: 'M', year: 1931 },
        { label: 'Requiem for a Dream', year: 2000 },
        { label: 'Amélie', year: 2001 },
        { label: 'A Clockwork Orange', year: 1971 },
        { label: 'Like Stars on Earth', year: 2007 },
        { label: 'Taxi Driver', year: 1976 },
        { label: 'Lawrence of Arabia', year: 1962 },
        { label: 'Double Indemnity', year: 1944 },
        {
            label: 'Eternal Sunshine of the Spotless Mind',
            year: 2004,
        },
        { label: 'Amadeus', year: 1984 },
        { label: 'To Kill a Mockingbird', year: 1962 },
        { label: 'Toy Story 3', year: 2010 },
        { label: 'Logan', year: 2017 },
        { label: 'Full Metal Jacket', year: 1987 },
        { label: 'Dangal', year: 2016 },
        { label: 'The Sting', year: 1973 },
        { label: '2001: A Space Odyssey', year: 1968 },
        { label: "Singin' in the Rain", year: 1952 },
        { label: 'Toy Story', year: 1995 },
        { label: 'Bicycle Thieves', year: 1948 },
        { label: 'The Kid', year: 1921 },
        { label: 'Inglourious Basterds', year: 2009 },
        { label: 'Snatch', year: 2000 },
        { label: '3 Idiots', year: 2009 },
        { label: 'Monty Python and the Holy Grail', year: 1975 },
    ];
    const [departmentHeads, setDepartmentHeads] = useState([]);
    const [selectProjectLead, setProjectLead] = useState([]);
    const [selectmembers, setMembers] = useState([]);
    const [userNamesEmail, setUserNamesEmail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        groupName: '',
        deptHead: [],
        projectLead: [],
        members: [],
        profilePic: null
    });

    const handleChange = (e, value, fieldName) => {
        // Map selected user names to corresponding user objects
        const selectedUsers = value.map((name) => {
            return selectmembers.find((member) => member.name === name);
        });
        setFormData({ ...formData, [fieldName]: selectedUsers });
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFormData({ ...formData, profilePic: reader.result });
        };
        reader.onerror = (error) => {
            console.error('Error reading the file:', error);
        };
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://3.85.170.118:5000/api/tgroups", formData);
            console.log(response.data);
            resetForm();
            toast.success("Group created successfully!");
            setInterval(() => {
                window.location.reload();
            }, 2000)
        } catch (error) {
            console.error("Error creating group:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error("Error: " + error.response.data.error);
            } else {
                toast.error("Failed to create group. Please try again later.");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            groupName: '',
            deptHead: [],
            projectLead: [],
            members: [],
            profilePic: null
        });
    };
    useEffect(() => {
        const fetchRegisteredNames = async () => {
            try {
                const response = await axios.get("http://3.85.170.118:5000/api/userData");
                setUserNamesEmail(response.data);
                const filteredDepartmentHeads = response.data.filter(
                    (user) => user.userRole === 1
                );
                setDepartmentHeads(filteredDepartmentHeads);
                const filteredProjectlead = response.data.filter(
                    (user) => user.userRole === 2
                );
                setProjectLead(filteredProjectlead);
                const filtermember = response.data.filter(
                    (user) => user.userRole === 3
                );
                setMembers(filtermember);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Internal Server Error");
                setLoading(false);
            }
        };

        fetchRegisteredNames();
    }, []);
    console.log("userDa", userNamesEmail)
    return (
        <div>


            <form className="space-y-6" onSubmit={handleSubmit}>
                <div >
                    <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="profile-pic">
                        Profile Pic
                    </label>
                    <input
                        id="profile-pic"
                        className="block w-full rounded-lg border p-2.5 text-gray-900 bg-white"
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <label for="group-name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Group Name
                    </label>
                    <input
                        id="group-name"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900    dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Enter group name"
                        required=""
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    />
                </div>
                <div>
                    <label for="department-head" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Department Head
                    </label>
                    <Autocomplete
                        id="department-head"
                        className="mb-3"
                        options={departmentHeads.map((head) => head.name)}
                        multiple
                        onChange={(e, value) => handleChange(e, value, 'deptHead')}
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                    />
                </div>
                <div>
                    <label for="project-lead" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Project Lead
                    </label>
                    <Autocomplete
                        id="project-lead"
                        className="mb-3"
                        options={selectProjectLead.map((lead) => lead.name)}
                        multiple
                        onChange={(e, value) => handleChange(e, value, 'projectLead')}
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                    />

                </div>
                <div>
                    <label for="members" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Members
                    </label>

                    <Autocomplete
                        placeholder="Search Members"
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                        options={selectmembers.map((lead) => lead.name)}
                        onChange={(e, value) => handleChange(e, value, 'members')}
                        multiple
                    // sx={{ width: 300 }}
                    />
                </div>

                <div className='flex justify-end' >
                    <Button
                        type='submit'
                    >
                        Create Group
                    </Button>
                </div>
                <div></div>
            </form>
        </div>

    )
}

export default CreateGroups
