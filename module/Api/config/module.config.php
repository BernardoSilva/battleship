<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

return array(
    'router' => array(
        'routes' => array(
            'api' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/api',
                    'defaults' => array(
                        'controller' => 'api.controller',
                        'action'     => 'index',
                    ),

                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'game' => array(
                        'type'    => 'Literal',
                        'options' => array(
                            'route'    => '/game',
                            'defaults' => array(
                                'controller'    => 'api.controller',
                                'action'        => 'index',
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            'ships' => array(
                                'type'    => 'Segment',
                                'options' => array(
                                    'route'    => '/ships',
                                    'defaults' => array(
                                        'controller' => 'api.controller',
                                        'action' => 'addShip'
                                    ),
                                ),
                                'child_routes' => array(
                                    'add' => array(
                                        'type'    => 'Segment',
                                        'options' => array(
                                            'route'    => '/add',
                                            'defaults' => array(
                                                'controller' => 'api.controller',
                                                'action' => 'addShip'
                                            ),
                                        ),
                                    ),
                                    'get' => array(
                                        'type'    => 'Segment',
                                        'options' => array(
                                            'route'    => '/get',
                                            'defaults' => array(
                                                'controller' => 'api.controller',
                                                'action' => 'getShips'
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),

        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'aliases' => array(
            'translator' => 'MvcTranslator',
        ),
    ),

    'controllers' => array(
        'invokables' => array(
            'api.controller' => 'Api\Controller\ApiController'
        ),
    ),
    'view_manager' => array(
//        'display_not_found_reason' => true,
//        'display_exceptions'       => true,
//        'doctype'                  => 'HTML5',
//        'not_found_template'       => 'error/404',
//        'exception_template'       => 'error/index',
//        'template_map' => array(
////            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
////            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
//            'error/404'               => __DIR__ . '/../view/error/404.phtml',
//            'error/index'             => __DIR__ . '/../view/error/index.phtml',
//        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy'
        )
    ),

);
