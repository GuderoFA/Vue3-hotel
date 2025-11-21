const host = "http://server.vippo.ru/api";

const guestInfo = {
    name: null,
    surname: null,
    patronymic: null,
    birthday: null,
    gender: "м",
    document_type_id: null,
    document_number: null
}

const app = Vue.createApp({
    data() {
        return {
            page: 'index',
            id: null,
            mainInfo: {
                arr_date: null,
                dep_date: null,
                countGuest: 'Количество',
                email: null,
                phone: null,
                city: null,
                room_category_id: 1,
            },
            auth: {
                login: null,
                password: null,
            },
            guests: [],
            bookingData: {},
            categoryInfo: {},
            onceCategory: {},
            allBooks: {},
            userToken: null,
            curInfoBook: {},
            statusZayavus: null,
            search: null,
            allManagers: {},
            curManager: {
                name: null,
                surname: null,
                patronymic: null,
                login: null,
                password: null,
                photo_file: null,
            },
            allPrices: {},
            addPrice: {
                room_category_id: null,
                value: null,
                start_date: null,
            },
            totalPrice: []
        }
    },
    mounted() {
        if (this.page === 'index') {
            document.body.classList.add('backGroundIndex');
        }
        this.getLocal();
        this.getCategoryInfo();
        this.allBookinCheck();
        this.getAllManagers();
        this.showAllPrice();
        this.random();
    },
    watch: {
        page(newPage) {
            if (newPage === 'index') {
                document.body.classList.add('backGroundIndex');
            } else {
                document.body.classList.remove('backGroundIndex');
            }
        }
    },
    methods: {
        openPage(thisPage) {
            this.page = thisPage
            localStorage.curPage = JSON.stringify(thisPage);
        },
        removeGuest(guestId) {
            const guestIndex = this.guests.findIndex(guest => guest.id === guestId);
            if (guestIndex !== -1 && guestId !== 1) {
                this.guests.splice(guestIndex, 1);
                this.guests.forEach((guest, index) => {
                    guest.id = index + 1;
                });
                this.id = this.guests.length;
            } else if (guestId === 1) {
                alert('Нельзя удалить первого гостя');
            }
        },
        priceCalculate(room_id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "arr_date": this.mainInfo.arr_date,
                "dep_date": this.mainInfo.dep_date,
                "room_category_id": room_id
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(host + "/calculation", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    const totalPrice = result.data.reduce((sum, day) => {
                        return sum + day.value;
                    }, 0);
                    this.totalPrice.push({
                        totalPrice
                    });
                })
                .catch((error) => console.error(error));
        },
        random() {
            for (let i = 0; i < 11; i++) {
                this.totalPrice.push({
                    totalPrice: Math.floor(Math.random() * (15000 - 1000 + 1)) + 1000
                });
            }
        },
        nextBooking() {
            if (!this.mainInfo.arr_date || !this.mainInfo.dep_date || this.mainInfo.countGuest == 'Количество') {
                alert('Ошибка');
            }
            else {
                this.openPage('addBooking');
                this.guests = [];
                for (let i = 0; i < this.mainInfo.countGuest; i++) {
                    this.guests.push({
                        name: null,
                        surname: null,
                        patronymic: null,
                        birthday: null,
                        gender: "м",
                        document_type_id: null,
                        document_number: null,
                        id: i + 1
                    });
                    this.id = i + 1
                }
                this.getCategoryInfo()
            }
        },
        addNewGuest() {
            if (this.id < 3) {
                this.id += 1;
                this.guests.push({
                    name: null,
                    surname: null,
                    patronymic: null,
                    birthday: null,
                    gender: "м",
                    document_type_id: null,
                    document_number: null,
                    id: this.id
                });
            }
            else {
                alert('У вас переполнены гости')
            }
        },
        addBooking() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "arr_date": this.mainInfo.arr_date,
                "dep_date": this.mainInfo.dep_date,
                "room_category_id": this.mainInfo.room_category_id,
                "email": this.mainInfo.email,
                "phone": this.mainInfo.phone,
                "city": this.mainInfo.city,
                "guests": this.guests
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(host + "/booking", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.bookingData = result;
                    this.openPage('booking')
                })
                .catch((error) => {
                    console.error(error);

                });
        },
        getCategoryInfo() {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            fetch(host + "/category", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.categoryInfo = result;
                })
                .catch((error) => console.error(error));
        },
        getOnceCategory(id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(host + "/category/" + id, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.onceCategory = result;
                    this.openPage('category');
                })
                .catch((error) => console.error(error));
        },
        priceForCategory(room_id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "arr_date": this.mainInfo.arr_date,
                "dep_date": this.mainInfo.dep_date,
                "room_category_id": room_id
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(host + "/calculation", requestOptions)
                .then((response) => response.json())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        },
        login() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "login": this.auth.login,
                "password": this.auth.password
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(host + "/login", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    localStorage.user = JSON.stringify(result.data.user_token);
                    this.userToken = JSON.parse(localStorage.user);
                    this.openPage('manager');
                    this.allBookinCheck();
                    this.getAllManagers();
                    this.showAllPrice();

                })
                .catch((error) => console.error(error));
        },
        allBookinCheck() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(host + "/booking", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.allBooks = result.data;
                })
                .catch((error) => console.error(error));
        },
        checkBookByCode(code) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(host + "/booking/" + code, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.bookingData = result;
                    this.openPage('booking');

                })
                .catch((error) => console.error(error));
        },
        BookingStatusChange() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const raw = JSON.stringify({
                "booking_status_id": this.statusZayavus
            });

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(host + "/booking/" + this.bookingData.data.id, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.openPage('manager')
                    this.allBookinCheck()
                })
                .catch((error) => console.error(error));
        },
        logout() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(host + "/logout", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.userToken = null;
                    localStorage.user = null;
                    this.openPage('index')
                })
                .catch((error) => console.error(error));
        },
        getAllManagers() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(host + "/user", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.allManagers = result.data;
                })
                .catch((error) => console.error(error));
        },
        removeManager(id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(host + "/user/" + id + "/to-dismiss", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.getAllManagers()
                })
                .catch((error) => console.error(error));
        },
        addManger() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const formdata = new FormData();
            formdata.append("name", this.curManager.name);
            formdata.append("surname", this.curManager.surname);
            formdata.append("patronymic", this.curManager.patronymic);
            formdata.append("login", this.curManager.login);
            formdata.append("password", this.curManager.password);
            formdata.append("photo_file", this.curManager.photo_file, this.curManager.name);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            fetch(host + "/user", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.openPage('manager');
                    this.getAllManagers()
                })
                .catch((error) => console.error(error));
        },
        handleFileUpload(img) {
            this.curManager.photo_file = img.target.files[0];
        },
        showAllPrice() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(host + "/price", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.allPrices = result.data
                })
                .catch((error) => console.error(error));
        },
        changePrice(id, value) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const raw = JSON.stringify({
                "value": value
            });

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(host + "/price/" + id, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    this.showAllPrice()
                })
                .catch((error) => console.error(error));
        },
        addPricese() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + this.userToken);

            const raw = JSON.stringify({
                "room_category_id": this.addPrice.room_category_id,
                "value": this.addPrice.value,
                "start_date": this.addPrice.start_date
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(host + "/price", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    this.openPage('manager');
                    this.showAllPrice();
                })
                .catch((error) => console.error(error));
        },
        getLocal() {
            this.page = JSON.parse(localStorage.curPage)
            this.userToken = JSON.parse(localStorage.user)
        }
    }
}).mount('#app');