(function () {
  'use strict';
  angular
    .module('mad')
    .controller('AdvertCtrl', AdvertCtrl);

  function AdvertCtrl($scope, $state, AdvertisementSrv, NoticeSrv) {
    var i = 0;
    $scope.advertList = [];
    $scope.itemsByPage = 10;
    $scope.advertCollection = [];

    // 获取广告信息
    AdvertisementSrv.getReleaseAdvertisement().get().$promise.then(function(response) {
        if (response.errCode === 0) {
          for (i = 0; i < response.advertisement.length; i += 1) {
            var advert = response.advertisement[i];
            $scope.advertList.push(AdvertisementSrv.parseAdvertisement(advert, i));
          }
          // console.log($scope.advertList);
          $scope.advertCollection = [].concat($scope.advertList);
        }
      }, function(error) {
        console.log('获取广告列表失败');
        NoticeSrv.error('获取广告列表失败');
      });
    $scope.advertCollection = [].concat($scope.advertList);

    //下架接口
    $scope.removeAdvertisementById = function (id) {
      AdvertisementSrv.removeAdvertisementById().save({
        id: id
      }).$promise.then(
        function (response) {
          console.log(response.errMessage);
          if (0 === response.errCode) {
            NoticeSrv.success("广告下架成功");
            
            $state.reload('app.advert');
          }
        }, function (error) {
          NoticeSrv.notice('未知错误:' + error);
        }
      );
    };

    
    //提交审核接口
    $scope.submitAdvertisementById = function (id) {
      if(id == null) {
        NoticeSrv.notice("广告ID有误");
        return;
      }
      //输入有效
      $scope.thereIsError = false;
      //发送请求
      AdvertisementSrv.submitAdvertisementById().get({
        id: id
      }).$promise.then(
        function (response) {
          console.log(response);
          if (0 == response.errCode) {
            NoticeSrv.success("广告提交审核成功");

            $state.reload('app.advert');
          } else {
            // 错误处理
            NoticeSrv.notice('未知错误:' + response.errCode);
          }
        }, function (error) {
          NoticeSrv.notice('未知错误:' + error);
        }
      );
    }
  }
})();
