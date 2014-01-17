angular.module('Customers', []).
  value('PRETEND_API_DATA', [
    {
      id: 8,
      name: 'Stephen'
    },
    {
      id: 35,
      name: 'Dave'
    },
    {
      id: 70,
      name: 'John'
    }
  ]).
  value('SORT_BY_PROPERTY', function (dataset, property) {
    return angular.copy(dataset).
      sort(function (a, b) {
        return a[property] > b[property];
      });
  }).
  factory('Sort', function (SORT_BY_PROPERTY) {
    return {
      sortByProperty: SORT_BY_PROPERTY
    };
  });


// JUST USING THE `Sort` FACTORY
angular.module('Customers').
  factory('Customers', function (PRETEND_API_DATA, Sort) {
    return {
      raw: PRETEND_API_DATA,
      sorted: Sort.sortByProperty(PRETEND_API_DATA, 'name')
    };
  }).

  controller('ListCtrl', function ($scope, Customers) {
    $scope.Customers = Customers;
  });


// USING A MIXIN
angular.module('Customers').
  factory('MixIn', function ($injector) {
    return function (dataset, mixin) {
      mixin = angular.copy($injector.get(mixin));

      return angular.extend(
        { data: dataset },
        angular.forEach(mixin, function (fn, key) {
          mixin[key] = fn.bind({}, dataset);
        })
      );
    }
  }).

  factory('CustomersMixin', function (PRETEND_API_DATA, MixIn) {
    var CustomersMixin = MixIn(PRETEND_API_DATA, 'Sort');

    return {
      raw: CustomersMixin.data,
      sorted: CustomersMixin.sortByProperty('name')
    };
  }).

  controller('ListMixinCtrl', function ($scope, CustomersMixin) {
    $scope.Customers = CustomersMixin;
  });


// INHERITANCE
angular.module('Customers').
  service('List', function (Sort) {
    function List(opts) {
      this.data = opts.data;
    }

    List.prototype.sortByProperty = function (property) {
      return Sort.sortByProperty(this.data, property);
    };

    return List;
  }).

  factory('CustomersList', function (PRETEND_API_DATA, List) {
    var CustomersList = new List({
      data: PRETEND_API_DATA
    });

    return {
      raw: CustomersList.data,
      sorted: CustomersList.sortByProperty('name')
    }
  }).

  controller('ListInheritanceCtrl', function ($scope, CustomersList) {
    $scope.Customers = CustomersList;
  });
