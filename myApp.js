/**
 * Created by Fuad Hasbun on 10/29/2016.
 */
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.dropDownCourses;
    $scope.dropDownClassNum;
    $scope.enterHeaders = false;
    //TODO: Add functionality of picking the semester
    //TODO: When you switch department the table isn't deleted until selecting course number
    $scope.courseAtTechLink = "http://coursesat.tech/spring2016/";
    $http.get($scope.courseAtTechLink)
        .then(function(response) {
            $scope.classData = JSON.stringify(response.data);
            // $scope.firstLetter = $scope.classData[0];
            var i = 0;
            var j = 0;
            var courseArr = [];
            var myCourse = "";
            for (i; i < $scope.classData.length; i++) {
                if ($scope.classData[i] == '"') {

                    j = i + 1;
                    myCourse = "";
                    while($scope.classData[j] != '"') {
                        myCourse = myCourse + $scope.classData[j];
                        j++;
                    }
                    courseArr.push(myCourse);
                    i = j;
                }
            }
            $scope.myCourseArr = courseArr;
        });
    var countDepartment = 0;
    $scope.what = false;
    $scope.$watch(function(scope) { return scope.dropDownCourses },
        function(newValue, oldValue) {
            if (newValue) {
                if (countDepartment == 0) {
                    $scope.courseAtTechLink = $scope.courseAtTechLink + newValue + "/";
                    countDepartment = 1;
                } else if (countDepartment == 1 /*&& countClassNum == 1*/) {
                    var restartInd = $scope.courseAtTechLink.indexOf(oldValue);
                    $scope.courseAtTechLink = $scope.courseAtTechLink.substring(0, $scope.courseAtTechLink.length - ($scope.courseAtTechLink.length - restartInd));
                    $scope.courseAtTechLink = $scope.courseAtTechLink + newValue + "/";
                } //else if (countDepartment == 1) {
                //     $scope.courseAtTechLink = $scope.courseAtTechLink.substring(0, $scope.courseAtTechLink.length - 1).replace(oldValue, '');
                //     $scope.courseAtTechLink = $scope.courseAtTechLink + newValue + "/";
                // }
            }
            $scope.what = angular.equals($scope.courseAtTechLink,"http://coursesat.tech/spring2016/" + newValue + "/" );
            $http.get($scope.courseAtTechLink)
                .then(function (response) {
                    $scope.courseNum = JSON.stringify(response.data["numbers"]);

                    var i = 0;
                    var j = 0;
                    var courseNumArr = [];
                    var myCourseNum = "";
                    for (i; i < $scope.courseNum.length; i++) {
                        if ($scope.courseNum[i] == '"') {

                            j = i + 1;
                            myCourseNum = "";
                            while($scope.courseNum[j] != '"') {
                                myCourseNum = myCourseNum + $scope.courseNum[j];
                                j++;
                            }
                            courseNumArr.push(myCourseNum);
                            i = j;
                        }
                    }
                    $scope.myCourseNumArr = courseNumArr;

                });
        }
    );
    var countClassNum = 0;
    $scope.$watch(function(scope) { return scope.dropDownClassNum},
        function(newValue, oldValue) {
            //The following if clauses are used to edit the link
            if (newValue) {
                if (countClassNum == 0) {
                    $scope.courseAtTechLink = $scope.courseAtTechLink + newValue;
                    countClassNum = 1;
                } else if (countClassNum == 1 && oldValue) {
                    var restartInd2 = $scope.courseAtTechLink.indexOf(oldValue);
                    $scope.courseAtTechLink = $scope.courseAtTechLink.substring(0, $scope.courseAtTechLink.length - ($scope.courseAtTechLink.length - restartInd2));
                    $scope.courseAtTechLink = $scope.courseAtTechLink + newValue;
                } else {
                    $scope.courseAtTechLink = $scope.courseAtTechLink + newValue;
                }
            }
            //TODO: Figure out how to get rid of extra quotations & brackets
            $http.get($scope.courseAtTechLink)
                .then(function(response) {
                    $scope.creditHours = JSON.stringify(response.data["hours"]).replace(/['"]+/g, '');
                    $scope.sectionLen = JSON.stringify(response.data["sections"].length);
                    var i = 0;
                    $scope.classDataArr = {
                        crn: [],
                        instructor: [],
                        meetings: []
                    };
                    $scope.meetings = {
                        time: []
                    };
                    var table = document.getElementById("courseDataTable");
                    table.innerHTML = "";
                    $scope.enterHeaders = false;
                    for (i; i < $scope.sectionLen; i++) {
                        $scope.courseData = JSON.stringify(response.data["sections"][i]["crn"]).replace(/['"]+/g, '');
                        $scope.classDataArr.crn.push($scope.courseData);
                        $scope.courseData = JSON.stringify(response.data["sections"][i]["instructors"]).replace(/['"]+/g, '');
                        $scope.classDataArr.instructor.push($scope.courseData);
                        $scope.meetingsLen = response.data["sections"][i]["meetings"].length;
                        if ($scope.meetingsLen) {
                            //do nothing
                        } else {
                            $scope.meetingsLen = 0;
                        }
                        var j = 0;
                        for (j; j < $scope.meetingsLen; j++) {
                            $scope.courseData = JSON.stringify(response.data["sections"][i]["meetings"][j]["time"]).replace(/['"]+/g, '');
                            $scope.meetings.time.push($scope.courseData);
                        }
                        $scope.classDataArr.meetings.push($scope.meetings.time);
                        $scope.meetings.time = [];
                        var row = table.insertRow();
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        if (!$scope.enterHeaders) {
                            cell1.innerHTML = "CRN";
                            cell2.innerHTML = "Instructor";
                            cell3.innerHTML = "Time";
                            $scope.enterHeaders = true;
                        } else {
                            cell1.innerHTML = $scope.classDataArr.crn[i];
                            cell2.innerHTML = $scope.classDataArr.instructor[i];
                            cell3.innerHTML = $scope.classDataArr.meetings[i];
                        }


                    }
                });
        }
    );


    // var x;
    // $scope.bigImg = function (x) {
    //     x.style.height = "64px";
    //     x.style.width = "64px";
    // }

});
// var x;
// function bigImg(x) {
//     x.style.height = "64px";
//     x.style.width = "64px";
// }

var y;
function normalImg(y) {
    y.style.height = "32px";
    y.style.width = "32px";
}

function myFunction() {
    document.getElementById("courseDataTable").rows[1].innerHTML = "something";
    var btn = document.createElement("BUTTON");
    // document.body.appendChild(btn);
    document.getElementById("createButton").appendChild(btn);
}


app.controller('boxController', ['$scope', function($scope) {
    var x;
    $scope.bigImg = function (x) {
        x.style.height = "64px";
        x.style.width = "64px";
    }
    $scope.spice = 'very';

    $scope.chiliSpicy = function() {
        $scope.spice = 'chili';
    };

    $scope.jalapenoSpicy = function() {
        $scope.spice = 'jalapeño';
    };
}]);;